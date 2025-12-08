import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Select,
  Modal,
  Space,
  Popconfirm,
  message,
} from "antd";
import axios from "axios";

interface Persona {
  id: number;
  nombre: string;
  apellido: string;
}

interface Inmueble {
  id: number;
  matricula: string;
}

interface PersonaInmueble {
  id: number;
  persona: Persona;
  inmueble: Inmueble;
  numerador: number;
  denominador: number;
}

interface ActoInmueble {
  id: number;
  actoRegistral: { descripcion: string };
  inmueble: { matricula: string };
}

interface ActoInmueblePersona {
  id: number;
  actoInmueble: ActoInmueble;
  personaInmueble: PersonaInmueble;
}

const API = "http://localhost:8080/api/actos-inmuebles-personas";
const API_AI = "http://localhost:8080/api/actos-inmuebles";
// 👇 nuevo: endpoint de PersonaInmueble (ajustá el path si es distinto)
const API_PERSONAS_INMUEBLES = "http://localhost:8080/api/personas-inmuebles";

const ActosInmueblesPersonasPage = () => {
  const [items, setItems] = useState<ActoInmueblePersona[]>([]);
  const [actosInmuebles, setActosInmuebles] = useState<ActoInmueble[]>([]);
  const [personasInmuebles, setPersonasInmuebles] = useState<PersonaInmueble[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<ActoInmueblePersona | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const cargar = async () => {
    try {
      setLoading(true);
      const [ap, ai, pi] = await Promise.all([
        axios.get(API),
        axios.get(API_AI),
        axios.get(API_PERSONAS_INMUEBLES),
      ]);

      setItems(ap.data);
      setActosInmuebles(ai.data);
      setPersonasInmuebles(pi.data);
    } catch {
      message.error("Error cargando datos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargar();
  }, []);

  const abrirNuevo = () => {
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  };

  const abrirEditar = (item: ActoInmueblePersona) => {
    setEditing(item);
    form.setFieldsValue({
      actoInmuebleId: item.actoInmueble.id,
      personaInmuebleId: item.personaInmueble.id,
    });
    setOpenModal(true);
  };

  const guardar = async () => {
    const v = await form.validateFields();

    const payload = {
      actoInmueble: { id: v.actoInmuebleId },
      personaInmueble: { id: v.personaInmuebleId },
    };

    try {
      if (editing) {
        await axios.put(`${API}/${editing.id}`, payload);
        message.success("Actualizado");
      } else {
        await axios.post(API, payload);
        message.success("Asignación creada");
      }
      setOpenModal(false);
      cargar();
    } catch {
      message.error("Error al guardar");
    }
  };

  const eliminar = async (item: ActoInmueblePersona) => {
    try {
      await axios.delete(`${API}/${item.id}`);
      message.success("Eliminado");
      cargar();
    } catch {
      message.error("No se pudo eliminar");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Personas en Actos Registrales</h1>

      <Button type="primary" onClick={abrirNuevo} style={{ marginBottom: 16 }}>
        Agregar Persona a Acto
      </Button>

      <Table dataSource={items} loading={loading} rowKey="id">
        <Table.Column
          title="Acto - Inmueble"
          render={(_, r: ActoInmueblePersona) =>
            `${r.actoInmueble.actoRegistral.descripcion} – ${r.actoInmueble.inmueble.matricula}`
          }
        />
        <Table.Column
          title="Persona"
          render={(_, r: ActoInmueblePersona) =>
            `${r.personaInmueble.persona.apellido}, ${r.personaInmueble.persona.nombre}`
          }
        />
        <Table.Column
          title="Participación"
          render={(_, r: ActoInmueblePersona) =>
            `${r.personaInmueble.numerador}/${r.personaInmueble.denominador}`
          }
        />
        <Table.Column
          title="Acciones"
          render={(_, record: ActoInmueblePersona) => (
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
        open={openModal}
        title={editing ? "Editar asignación" : "Agregar asignación"}
        onOk={guardar}
        onCancel={() => setOpenModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Acto Inmueble"
            name="actoInmuebleId"
            rules={[{ required: true }]}
          >
            <Select
              options={actosInmuebles.map((ai) => ({
                value: ai.id,
                label: `${ai.actoRegistral.descripcion} – ${ai.inmueble.matricula}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Persona / Titularidad"
            name="personaInmuebleId"
            rules={[{ required: true }]}
          >
            <Select
              options={personasInmuebles.map((pi) => ({
                value: pi.id,
                label: `${pi.persona.apellido}, ${pi.persona.nombre} – ${pi.inmueble.matricula} (${pi.numerador}/${pi.denominador})`,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActosInmueblesPersonasPage;
