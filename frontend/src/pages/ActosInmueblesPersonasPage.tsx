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

interface TipoParticipacion {
  id: number;
  descripcion: string;
}

interface ActoInmueble {
  id: number;
  actoRegistral: { descripcion: string };
  inmueble: { matricula: string };
}

interface ActoInmueblePersona {
  id: number;
  actoInmueble: ActoInmueble;
  persona: Persona;
  tipoParticipacion: TipoParticipacion;
}

const API = "http://localhost:8080/api/actos-inmuebles-personas";
const API_AI = "http://localhost:8080/api/actos-inmuebles";
const API_PERSONAS = "http://localhost:8080/api/personas";
const API_TIPOS = "http://localhost:8080/api/tipos-participaciones";

const ActosInmueblesPersonasPage = () => {
  const [items, setItems] = useState<ActoInmueblePersona[]>([]);
  const [actosInmuebles, setActosInmuebles] = useState<ActoInmueble[]>([]);
  const [personas, setPersonas] = useState<Persona[]>([]);
  const [tipos, setTipos] = useState<TipoParticipacion[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<ActoInmueblePersona | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();

  const cargar = async () => {
    try {
      setLoading(true);
      const [ap, ai, per, tp] = await Promise.all([
        axios.get(API),
        axios.get(API_AI),
        axios.get(API_PERSONAS),
        axios.get(API_TIPOS),
      ]);

      setItems(ap.data);
      setActosInmuebles(ai.data);
      setPersonas(per.data);
      setTipos(tp.data);
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
      personaId: item.persona.id,
      tipoParticipacionId: item.tipoParticipacion.id,
    });
    setOpenModal(true);
  };

  const guardar = async () => {
    const v = await form.validateFields();

    const payload = {
      actoInmueble: { id: v.actoInmuebleId },
      persona: { id: v.personaId },
      tipoParticipacion: { id: v.tipoParticipacionId },
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
          title="Acto-Inmueble"
          render={(_, r) =>
            `${r.actoInmueble.actoRegistral.descripcion} – ${r.actoInmueble.inmueble.matricula}`
          }
        />
        <Table.Column
          title="Persona"
          render={(_, r) => `${r.persona.apellido}, ${r.persona.nombre}`}
        />
        <Table.Column
          title="Participación"
          render={(_, r) => r.tipoParticipacion.descripcion}
        />
        <Table.Column
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
        open={openModal}
        title={editing ? "Editar Participación" : "Agregar Participación"}
        onOk={guardar}
        onCancel={() => setOpenModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Acto Inmueble" name="actoInmuebleId" rules={[{ required: true }]}>
            <Select
              options={actosInmuebles.map((ai) => ({
                value: ai.id,
                label: `${ai.actoRegistral.descripcion} – ${ai.inmueble.matricula}`,
              }))}
            />
          </Form.Item>

          <Form.Item label="Persona" name="personaId" rules={[{ required: true }]}>
            <Select
              options={personas.map((p) => ({
                value: p.id,
                label: `${p.apellido}, ${p.nombre}`,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Tipo de Participación"
            name="tipoParticipacionId"
            rules={[{ required: true }]}
          >
            <Select
              options={tipos.map((t) => ({
                value: t.id,
                label: t.descripcion,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActosInmueblesPersonasPage;
