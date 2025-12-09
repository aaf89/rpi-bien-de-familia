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
} from "antd";
import axios from "axios";


interface PersonasPageProps {
  onVerInmuebles?: (id: number) => void;
}

interface PersonaDTO {
  id: number;
  cuit: string;
  apellido: string;
  nombre: string;
  cantInmuebles: number;
}

const API_URL = "http://localhost:8080/api/personas";

const PersonasPage: React.FC<PersonasPageProps> = ({ onVerInmuebles }) => {
  const [personas, setPersonas] = useState<PersonaDTO[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingPersona, setEditingPersona] = useState<PersonaDTO | null>(null);
  const [form] = Form.useForm();

  const cargarPersonas = async () => {
    try {
      setLoading(true);
      const res = await axios.get<PersonaDTO[]>(
        API_URL
      );
      setPersonas(res.data);
    } catch (e) {
      message.error("Error al cargar la persona");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarPersonas();
  }, []);

  // Abrir modal para NUEVO
    const abrirModalNuevo = () => {
      setEditingPersona(null);
      form.resetFields();
      setOpenModal(true);
    };

    // Abrir modal para EDITAR
    const abrirModalEditar = (persona: PersonaDTO) => {
      setEditingPersona(persona);
      form.setFieldsValue({
        cuit: persona.cuit,
        apellido: persona.apellido,
		nombre: persona.nombre
      });
      setOpenModal(true);
    };

    // Guardar (crear o editar según corresponda)
    const onGuardar = async () => {
      try {
        const values = await form.validateFields();

        if (editingPersona) {
          // EDITAR
          await axios.put(
            `${API_URL}/${editingPersona.id}`,
            {
              ...editingPersona,
              ...values,
            }
          );
          message.success("Persona actualizado correctamente");
        } else {
          // CREAR
          await axios.post("http://localhost:8080/api/personas", values);
          message.success("Personas creado correctamente");
        }

        setOpenModal(false);
        form.resetFields();
        setEditingPersona(null);
        cargarPersonas();
      } catch (e) {
			if (e?.errorFields) return; // error de validación del form, no mostramos mensaje extra
			  console.error("Error al guardar inmueble", e);

			  const backendMessage =
			    e?.response?.data?.message || 
			    e?.response?.data?.error ||   // Spring manda "error": "Internal Server Error"
			    e?.message;                   // mensaje genérico de axios
	 		    message.error(backendMessage || "No se pudo guardar el inmueble");
		    }
    };

    // Eliminar
    const onEliminar = async (persona: PersonaDTO) => {
      try {
        await axios.delete(
          `http://localhost:8080/api/personas/${persona.id}`
        );
        message.success("Persona eliminado");
        cargarPersonas();
      } catch (e) {
		console.error("Error al eliminar la persona", e);
		      const backendMessage =
		        e?.response?.data?.message ||
		        e?.response?.data?.error ||
		        e?.message;

		      message.error(backendMessage || "No se pudo eliminar la persona");
		}
      
    };
  
    return (
      <div style={{ padding: 24 }}>
        <h1 style={{ marginBottom: 16 }}>Personas</h1>

        <Button
          type="primary"
          onClick={abrirModalNuevo}
          style={{ marginBottom: 16 }}
        >
          Nueva Persona
        </Button>

        <Table rowKey="id" dataSource={personas} loading={loading}>
          <Table.Column<PersonaDTO> title="ID" dataIndex="id" />
          <Table.Column<PersonaDTO> title="Cuit/Cuil" dataIndex="cuit" />
          <Table.Column<PersonaDTO>
            title="Apellidos"
            dataIndex="apellido"
          />
		  <Table.Column<PersonaDTO>
		    title="Nombres"
		    dataIndex="nombre"
		  />
		  
		  <Table.Column<PersonaDTO>
		  		  title="Titulares"
		  		  render={(_, record) => (
		  		    <Button
		  		      size="small"
		  		      onClick={() => onVerInmuebles && onVerInmuebles(record.id)}
		  		    >
		  				{`Ver Inmuebles (${record.cantInmuebles ?? 0})`}
		  		    </Button>
		  		  )}
		  		/>
				
          <Table.Column<PersonaDTO>
            title="Acciones"
            key="acciones"
            render={(_, record) => (
              <Space>
                <Button size="small" onClick={() => abrirModalEditar(record)}>
                  Editar
                </Button>
                <Popconfirm
                  title="¿Eliminar persona?"
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
          title={editingPersona ? "Editar Persona" : "Nueva Persona"}
          open={openModal}
          onCancel={() => {
            setOpenModal(false);
            setEditingPersona(null);
            form.resetFields();
          }}
          onOk={onGuardar}
          okText="Guardar"
          cancelText="Cancelar"
        >
          <Form form={form} layout="vertical">
		  <Form.Item
		    label="Cuit/Cuil"
		    name="cuit"
		    rules={[
		      { required: true, message: "El CUIL es obligatorio" },
		      {
		        pattern: /^\d{2}-\d{8}-\d$/,
		        message: "Formato inválido. Usá XX-XXXXXXXX-X",
		      },
		    ]}
		  >
		    <Input placeholder="Ej: 20-12345678-3" maxLength={13} />
		  </Form.Item>

            <Form.Item
              label="Apellidos"
              name="apellido"
              rules={[
                { required: true, message: "El apellido es obligatorio" },
              ]}
            >
			  <Input />
			</Form.Item>
			
			<Form.Item
			  label="Nombres"
			  name="nombre"
			  rules={[
			    { required: true, message: "El nombre es obligatorio" },
			  ]}
			>
			  <Input />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    );
  };

  export default PersonasPage;