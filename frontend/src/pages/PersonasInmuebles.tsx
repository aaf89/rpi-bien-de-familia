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
  persona: Persona;
  inmueble: Inmueble;
  numerador: number;
  denominador: number;
}

const API = "http://localhost:8080/api/personas-inmuebles";
const API_PERSONAS = "http://localhost:8080/api/personas";
const API_INMUEBLES = "http://localhost:8080/api/inmuebles";

const PersonasInmueblesPage = () => {
  const [items, setItems] = useState<PI[]>([]);
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
        axios.get(API),
        axios.get(API_PERSONAS),
        axios.get(API_INMUEBLES),
      ]);
      setItems(pi.data);
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
  }, []);

  const abrirNuevo = () => {
    setEditing(null);
    form.resetFields();
    setOpenModal(true);
  };

  const abrirEditar = (item: PI) => {
    setEditing(item);
    form.setFieldsValue({
      personaId: item.persona.id,
      inmuebleId: item.inmueble.id,
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

  return (
    <div style={{ padding: 24 }}>
      <h1>Titularidades (Persona – Inmueble)</h1>

      <Button type="primary" onClick={abrirNuevo} style={{ marginBottom: 16 }}>
        Nueva Titularidad
      </Button>

      <Table dataSource={items} loading={loading} rowKey="id">
        <Table.Column
          title="Persona"
          render={(_, r) => `${r.persona.apellido}, ${r.persona.nombre}`}
        />
        <Table.Column title="Inmueble" render={(_, r) => r.inmueble.matricula} />
        <Table.Column title="Parte" render={(_, r) => `${r.numerador}/${r.denominador}`} />
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
        title={editing ? "Editar Titularidad" : "Nueva Titularidad"}
        open={openModal}
        onOk={guardar}
        onCancel={() => setOpenModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Persona"
            name="personaId"
            rules={[{ required: true }]}
          >
            <Select
              options={personas.map((p) => ({
                label: `${p.apellido}, ${p.nombre}`,
                value: p.id,
              }))}
            />
          </Form.Item>

          <Form.Item
            label="Inmueble"
            name="inmuebleId"
            rules={[{ required: true }]}
          >
            <Select
              options={inmuebles.map((i) => ({
                label: i.matricula,
                value: i.id,
              }))}
            />
          </Form.Item>

          <Form.Item label="Numerador" name="numerador" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item label="Denominador" name="denominador" rules={[{ required: true }]}>
            <InputNumber min={1} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PersonasInmueblesPage;
