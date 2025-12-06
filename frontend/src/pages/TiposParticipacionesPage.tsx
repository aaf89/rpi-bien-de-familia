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

interface TipoParticipacion {
  id: number;
  descripcion: string;
}

const API_URL = "http://localhost:8080/api/tipos-participacion";

const TiposParticipacionPage = () => {
  const [items, setItems] = useState<TipoParticipacion[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<TipoParticipacion | null>(null);
  const [form] = Form.useForm();

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setItems(res.data);
    } catch {
      message.error("Error al cargar los tipos de participación");
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

  const abrirEditar = (item: TipoParticipacion) => {
    setEditing(item);
    form.setFieldsValue(item);
    setOpenModal(true);
  };

  const guardar = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, values);
        message.success("Actualizado");
      } else {
        await axios.post(API_URL, values);
        message.success("Creado");
      }

      setOpenModal(false);
      cargar();
    } catch {
      message.error("Error al guardar");
    }
  };

  const eliminar = async (item: TipoParticipacion) => {
    try {
      await axios.delete(`${API_URL}/${item.id}`);
      message.success("Eliminado");
      cargar();
    } catch {
      message.error("No se pudo eliminar");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Tipos de Participación</h1>

      <Button type="primary" onClick={abrirNuevo} style={{ marginBottom: 16 }}>
        Nuevo Tipo
      </Button>

      <Table dataSource={items} loading={loading} rowKey="id">
        <Table.Column title="ID" dataIndex="id" />
        <Table.Column title="Descripción" dataIndex="descripcion" />
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
        title={editing ? "Editar Tipo" : "Nuevo Tipo"}
        open={openModal}
        onOk={guardar}
        onCancel={() => setOpenModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: "Campo obligatorio" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TiposParticipacionPage;
