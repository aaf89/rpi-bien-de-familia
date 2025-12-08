import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  InputNumber,
  Modal,
  message,
  Space,
  Popconfirm,
  Select,
} from "antd";
import axios from "axios";

interface PersonasInmueblesPageProps {
  filtroInmuebleId?: number | null;
  filtroPersonaId?: number | null;
}

interface Persona {
  id: number;
  apellido: string;
  nombre: string;
}

interface Inmueble {
  id: number;
  matricula: string;
}

interface PI {
  id: number;
  persona?: Persona | null;
  inmueble?: Inmueble | null;
  numerador: number;
  denominador: number;
}

const API = "http://localhost:8080/api/personas-inmuebles";
const API_PERSONAS = "http://localhost:8080/api/personas";
const API_INMUEBLES = "http://localhost:8080/api/inmuebles";

const PersonasInmueblesPage: React.FC<PersonasInmueblesPageProps> = ({
  filtroInmuebleId, filtroPersonaId
}) => {  const [items, setItems] = useState<PI[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<PI | null>(null);
  const [form] = Form.useForm();

  const cargarTodo = async () => {
    try {
      setLoading(true);
      const [pi, p, i] = await Promise.all([
        axios.get<PI[]>(API),
        axios.get<Persona[]>(API_PERSONAS),
        axios.get<Inmueble[]>(API_INMUEBLES),
      ]);

	  const cleanItems = (pi.data ?? []).filter(
	    (x): x is PI => x != null
	  );

	  let lista = cleanItems;

	  if (filtroInmuebleId != null) {
	    lista = lista.filter(
	      (x) => x.inmueble && x.inmueble.id === filtroInmuebleId
	    );
	  }
	  
	  if (filtroPersonaId != null) {
	  	    lista = lista.filter(
	  	      (x) => x.persona && x.persona.id === filtroPersonaId
	  	    );
	  }

	  setItems(lista);
      setPersonas(p.data);
      setInmuebles(i.data);
    } catch {
      message.error("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    cargarTodo();
	}, [filtroInmuebleId, filtroPersonaId]);

  const abrirNuevo = () => {
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  };

  const abrirEditar = (item: PI) => {
    setEditing(item);
    form.setFieldsValue({
      personaId: item.persona?.id,       // igual que ciudad.departamento?.id
      inmuebleId: item.inmueble?.id,
      numerador: item.numerador,
      denominador: item.denominador,
    });
    setOpenModal(true);
  };

  const guardar = async () => {
    const values = await form.validateFields();

    const payload = {
      persona: { id: values.personaId },
      inmueble: { id: values.inmuebleId },
      numerador: values.numerador,
      denominador: values.denominador,
    };

    try {
      if (editing) {
        await axios.put(`${API}/${editing.id}`, payload);
        message.success("Actualizado");
      } else {
        await axios.post(API, payload);
        message.success("Creado");
      }
      setOpenModal(false);
      form.resetFields();
      setEditing(null);
      cargarTodo();
    } catch {
      message.error("Error al guardar");
    }
  };

  const eliminar = async (item: PI) => {
    try {
      await axios.delete(`${API}/${item.id}`);
      message.success("Eliminado");
      cargarTodo();
    } catch {
      message.error("No se pudo eliminar");
    }
  };

  const obtenerNombrePersona = (pi?: PI | null) => {
    if (!pi || !pi.persona) return "";
    return `${pi.persona.apellido}, ${pi.persona.nombre}`;
  };

  const obtenerInmuebleTexto = (pi?: PI | null) => {
    if (!pi || !pi.inmueble) return "";
    return pi.inmueble.matricula;
  };


  return (
    <div style={{ padding: 24 }}>
      <h1>	{filtroInmuebleId != null
		    ? "Titulares del Inmueble: " + obtenerInmuebleTexto(items[0])
		    : filtroPersonaId != null
		        ? "Inmuebles de: " + obtenerNombrePersona(items[0])
		        : "Titularidades (Persona - Inmueble)"}
	  </h1>

      <Button type="primary" onClick={abrirNuevo} style={{ marginBottom: 16 }}>
        Nueva Titularidad
      </Button>

	  <Table<PI>
	    dataSource={items}
	    loading={loading}
	    rowKey="id"
	  >
	    <Table.Column<PI> title="ID" dataIndex="id" />

	    <Table.Column<PI>
	      title="Persona"
	      render={(_, r) => obtenerNombrePersona(r)}
	    />

	    <Table.Column<PI>
	      title="Inmueble"
	      render={(_, r) => obtenerInmuebleTexto(r)}
	    />

	    <Table.Column<PI>
	      title="Parte"
	      render={(_, r) => `${r.numerador}/${r.denominador}`}
	    />

	    <Table.Column<PI>
	      title="Acciones"
	      render={(_, record) => (
	        <Space>
	          <Button size="small" onClick={() => abrirEditar(record)}>
	            Editar
	          </Button>
	          <Popconfirm title="¿Eliminar?" onConfirm={() => eliminar(record)}>
	            <Button size="small" danger>
	              Eliminar
	            </Button>
	          </Popconfirm>
	        </Space>
	      )}
	    />
	  </Table>

      <Modal
        title={editing ? "Editar Titularidad" : "Nueva Titularidad"}
        open={openModal}
        onOk={guardar}
        onCancel={() => {
          setOpenModal(false);
          setEditing(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Persona"
            name="personaId"
            rules={[{ required: true, message: "La persona es obligatoria" }]}
          >
            <Select
              options={personas.map((p) => ({
                label: `${p.apellido}, ${p.nombre}`,
                value: p.id,
              }))}
              placeholder="Seleccione una persona"
            />
          </Form.Item>

          <Form.Item
            label="Inmueble"
            name="inmuebleId"
            rules={[{ required: true, message: "El inmueble es obligatorio" }]}
          >
            <Select
              options={inmuebles.map((i) => ({
                label: i.matricula,
                value: i.id,
              }))}
              placeholder="Seleccione un inmueble"
            />
          </Form.Item>

          {/*<Form.Item
            label="Numerador"
            name="numerador"
            rules={[{ required: true, message: "El numerador es obligatorio" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            label="Denominador"
            name="denominador"
            rules={[
              { required: true, message: "El denominador es obligatorio" },
            ]}
          >
            <InputNumber min={1} />
          </Form.Item>*/}
        </Form>
      </Modal>
    </div>
  );
};

export default PersonasInmueblesPage;
