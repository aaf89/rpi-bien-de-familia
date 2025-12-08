import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Input,
  Modal,
  message,
  Space,
  Popconfirm,
  Select,
} from "antd";
import axios from "axios";

interface InmueblesPageProps {
  onVerTitulares?: (id: number) => void;
}

interface Persona {
  id: number;
  apellido: string;
  nombre: string;
}

interface InmuebleDTO {
  id: number;
  matricula: string;
  nomenclaturaCatastral: string;
  cantTitulares: number;
}

const InmueblesPage: React.FC<InmueblesPageProps> = ({ onVerTitulares }) => {
  const [inmuebles, setInmuebles] = useState<InmuebleDTO[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingInmueble, setEditingInmueble] = useState<InmuebleDTO | null>(null);
  const [form] = Form.useForm();
  
  const cargarInmuebles = async () => {
    try {
      setLoading(true);
	  const res = await axios.get<InmuebleDTO[]>(
	    "http://localhost:8080/api/inmuebles"
	  );
      setInmuebles(res.data);
    } catch (e) {
      message.error("Error al cargar inmuebles" + e);
    } finally {
      setLoading(false);
    }
  };

  const cargarPersonas = async () => {
    try {
      const res = await axios.get<Persona[]>("http://localhost:8080/api/personas");
      setPersonas(res.data);
    } catch {
      message.error("Error al cargar personas");
    }
  };
  
  
  useEffect(() => {
    cargarInmuebles();
	cargarPersonas();
  }, []);

  const abrirModalNuevo = () => {
    setEditingInmueble(null);
    form.resetFields();
    setOpenModal(true);
  };

  const abrirModalEditar = (inmueble: InmuebleDTO) => {
    setEditingInmueble(inmueble);
    form.setFieldsValue({
      matricula: inmueble.matricula,
      nomenclaturaCatastral: inmueble.nomenclaturaCatastral,
    });
    setOpenModal(true);
  };

  const onGuardar = async () => {
    try {
      const values = await form.validateFields();
      const { matricula, nomenclaturaCatastral, personaId } = values;

      if (editingInmueble) {
        // EDITAR inmueble: acá NO toco titulares
        await axios.put(
          `http://localhost:8080/api/inmuebles/${editingInmueble.id}`,
          { matricula, nomenclaturaCatastral }
        );
        message.success("Inmueble actualizado correctamente");
      } else {
        // CREAR: mando también personaId para que el back cree la titularidad
        await axios.post("http://localhost:8080/api/inmuebles", {
          matricula,
          nomenclaturaCatastral,
          personaId,
        });
        message.success("Inmueble creado correctamente");
      }

      setOpenModal(false);
      form.resetFields();
      setEditingInmueble(null);
      cargarInmuebles();
    } catch (e) {
		if (e?.errorFields) return; // error de validación del form, no mostramos mensaje extra

		  console.error("Error al guardar inmueble", e);

		  const backendMessage =
		    e?.response?.data?.message || // por si algún día devolvés {message: "..."}
		    e?.response?.data?.error ||   // en tu caso Spring manda "error": "Internal Server Error"
		    e?.message;                   // mensaje genérico de axios

		  message.error(backendMessage || "No se pudo guardar el inmueble");
    }
  };

  
  const onEliminar = async (inmueble: Inmueble) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/inmuebles/${inmueble.id}`
      );
      message.success("Inmueble eliminado");
      cargarInmuebles();
    } catch (e) {
		if (e?.errorFields) return; // error de validación del form, no mostramos mensaje extra

				  console.error("Error al guardar inmueble", e);

				  const backendMessage =
				    e?.response?.data?.message || // por si algún día devolvés {message: "..."}
				    e?.response?.data?.error ||   // en tu caso Spring manda "error": "Internal Server Error"
				    e?.message;                   // mensaje genérico de axios

				  message.error(backendMessage || "No se pudo guardar el inmueble");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Inmuebles</h1>

      <Button
        type="primary"
        onClick={abrirModalNuevo}
        style={{ marginBottom: 16 }}
      >
        Nuevo inmueble
      </Button>

      <Table rowKey="id" dataSource={inmuebles} loading={loading}>
        <Table.Column<InmuebleDTO> title="ID" dataIndex="id" />
        <Table.Column<InmuebleDTO> title="Matrícula" dataIndex="matricula" />
        <Table.Column<InmuebleDTO> title="Nomenclatura" dataIndex="nomenclaturaCatastral"/>

		<Table.Column<InmuebleDTO>
		  title="Titulares"
		  render={(_, record) => (
		    <Button
		      size="small"
		      onClick={() => onVerTitulares && onVerTitulares(record.id)}
		    >
				{`Ver Titulares (${record.cantTitulares ?? 0})`}
		    </Button>
		  )}
		/>

        <Table.Column<InmuebleDTO>
          title="Acciones"
          key="acciones"
          render={(_, record) => (
            <Space>
              <Button size="small" onClick={() => abrirModalEditar(record)}>
                Editar
              </Button>
              <Popconfirm
                title="¿Eliminar inmueble?"
                description="Esta acción no se puede deshacer."
                okText="Sí, eliminar"
                cancelText="Cancelar"
                onConfirm={() => onEliminar(record)}
              >
                <Button size="small" danger>
                  Eliminar
                </Button>
              </Popconfirm>
            </Space>
          )}
        />
      </Table>

      <Modal
        title={editingInmueble ? "Editar inmueble" : "Nuevo inmueble"}
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingInmueble(null);
          form.resetFields();
        }}
        onOk={onGuardar}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Matrícula"
            name="matricula"
            rules={[{ required: true, message: "La matrícula es obligatoria" }]}
          >
            <Input />
          </Form.Item>

		  <Form.Item
		    label="Nomenclatura catastral"
		    name="nomenclaturaCatastral"
		    rules={[
		      { required: true, message: "La nomenclatura es obligatoria" },
		      {
		        pattern: /^\d{4}-\d{4}-\d{4}-\d{4}-\d{4}$/,
		        message: "Formato inválido. Debe ser XXXX-XXXX-XXXX-XXXX-XXXX",
		      },
		    ]}
		  >
		    <Input placeholder="Ej: 1234-5678-9012-3456-7890" />
		  </Form.Item>
		  
		  {!editingInmueble && (
			<Form.Item
			    label="Persona"
			    name="personaId"
			    rules={[]}
			  >
			    <Select
			      placeholder="Seleccione una persona (opcional)"
			      allowClear
			    >
			      <Select.Option value={null}>— Sin titular —</Select.Option>

			      {personas.map((p) => (
			        <Select.Option key={p.id} value={p.id}>
			          {p.apellido}, {p.nombre}
			        </Select.Option>
			      ))}
			    </Select>
			  </Form.Item>
		  )}
		  
        </Form>
      </Modal>
    </div>
  );
};

export default InmueblesPage;
