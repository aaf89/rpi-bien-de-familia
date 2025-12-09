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
  onVerBienDeFamilia?: (id: number) => void;
}

interface Departamento {
  id: number;
  codigo: string;
  descripcion: string;
}

interface Ciudad {
  id: number;
  codigo: string;
  descripcion: string;
  departamento?: Departamento | null;
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
  ciudad?: Ciudad | null;          
  cantTitulares: number;
  tieneBienDeFamilia: boolean;
}

const API_INMUEBLES = "http://localhost:8080/api/inmuebles";
const API_PERSONAS = "http://localhost:8080/api/personas";
const API_CIUDADES = "http://localhost:8080/api/ciudades";

const InmueblesPage: React.FC<InmueblesPageProps> = ({
  onVerTitulares,
  onVerBienDeFamilia,
}) => {
  const [inmuebles, setInmuebles] = useState<InmuebleDTO[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingInmueble, setEditingInmueble] = useState<InmuebleDTO | null>(
    null
  );
  const [form] = Form.useForm();

  const cargarInmuebles = async () => {
    try {
      setLoading(true);
      const res = await axios.get<InmuebleDTO[]>(API_INMUEBLES);
      setInmuebles(res.data);
    } catch (e) {
      console.error(e);
      message.error("Error al cargar inmuebles");
    } finally {
      setLoading(false);
    }
  };

  const cargarPersonas = async () => {
    try {
      const res = await axios.get<Persona[]>(API_PERSONAS);
      setPersonas(res.data);
    } catch {
      message.error("Error al cargar personas");
    }
  };

  const cargarCiudades = async () => {
    try {
      const res = await axios.get<Ciudad[]>(API_CIUDADES);
      setCiudades(res.data);
    } catch {
      message.error("Error al cargar ciudades");
    }
  };

  useEffect(() => {
    cargarInmuebles();
    cargarPersonas();
    cargarCiudades();
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
      ciudadId: inmueble.ciudad?.id, 
    });
    setOpenModal(true);
  };

  const onGuardar = async () => {
    try {
      const values = await form.validateFields();
      const { matricula, nomenclaturaCatastral, personaId, ciudadId } = values;

      const payload: any = {
        matricula,
        nomenclaturaCatastral,
		ciudadId: ciudadId ?? null,
		//cantTitulares: 0,
		//tieneBienDeFamilia: false,
      };

      if (!editingInmueble) {
        // en alta además mandás personaId si viene
		  if (personaId !== undefined && personaId !== null) {
		    payload.personaId = personaId;
		  }      
	  }

      if (editingInmueble) {
        await axios.put(`${API_INMUEBLES}/${editingInmueble.id}`, payload);
        message.success("Inmueble actualizado correctamente");
      } else {
        await axios.post(API_INMUEBLES, payload);
        message.success("Inmueble creado correctamente");
      }

      setOpenModal(false);
      form.resetFields();
      setEditingInmueble(null);
      cargarInmuebles();
    } catch (e: any) {
      if (e?.errorFields) return; // error de validación del form

      console.error("Error al guardar inmueble", e);

      const backendMessage =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message;

      message.error(backendMessage || "No se pudo guardar el inmueble");
    }
  };

  const onEliminar = async (inmueble: InmuebleDTO) => {
    try {
      await axios.delete(`${API_INMUEBLES}/${inmueble.id}`);
      message.success("Inmueble eliminado");
      cargarInmuebles();
    } catch (e: any) {
      console.error("Error al eliminar inmueble", e);
      const backendMessage =
        e?.response?.data?.message ||
        e?.response?.data?.error ||
        e?.message;

      message.error(backendMessage || "No se pudo eliminar el inmueble");
    }
  };

  const ciudadOptions = ciudades.map((c) => ({
    label: `${c.descripcion}${
      c.departamento ? ` – ${c.departamento.descripcion}` : ""
    }`,
    value: c.id,
  }));

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
        <Table.Column<InmuebleDTO>
          title="Nomenclatura"
          dataIndex="nomenclaturaCatastral"
        />
        <Table.Column<InmuebleDTO>
          title="Ciudad"
          render={(_, record) => record.ciudad?.descripcion ?? ""}
        />
        <Table.Column<InmuebleDTO>
          title="Departamento"
          render={(_, record) =>
            record.ciudad?.departamento?.descripcion ?? ""
          }
        />

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
          title="Bien de Familia"
          key="bienDeFamilia"
          render={(_, record) => (
            <Button
              size="small"
              onClick={() =>
                onVerBienDeFamilia && onVerBienDeFamilia(record.id)
              }
              disabled={!onVerBienDeFamilia}
            >
              {record.tieneBienDeFamilia
                ? "Ver Bien de Familia"
                : "Asociar Bien de Familia"}
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
            <Input placeholder="Ej: 5803-1234-5678-9012-3456" />
          </Form.Item>

          <Form.Item
            label="Ciudad"
            name="ciudadId"
            rules={[{ required: true, message: "La ciudad es obligatoria" }]}
          >
            <Select
              options={ciudadOptions}
              placeholder="Seleccione una ciudad"
              showSearch
              optionFilterProp="label"
            />
          </Form.Item>

          {!editingInmueble && (
            <Form.Item label="Persona" name="personaId" rules={[]}>
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
