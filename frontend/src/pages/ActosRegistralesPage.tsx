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

interface ActoRegistral {
  id: number;
  descripcion: string;
}

const API_URL = "http://localhost:8080/api/actos-registrales";

const ActosRegistralesPage = () => {
  const [actos, setActos] = useState<ActoRegistral[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<ActoRegistral | null>(null);
  const [form] = Form.useForm();

  const cargar = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_URL);
      setActos(res.data);
    } catch {
      message.error("Error al cargar los actos registrales");
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

  const abrirEditar = (item: ActoRegistral) => {
    setEditing(item);
    form.setFieldsValue(item);
    setOpenModal(true);
  };

  const guardar = async () => {
    try {
      const values = await form.validateFields();

      if (editing) {
        await axios.put(`${API_URL}/${editing.id}`, values);
        message.success("Acto actualizado");
      } else {
        await axios.post(API_URL, values);
        message.success("Acto creado");
      }

      setOpenModal(false);
      cargar();
    } catch {
      message.error("Error al guardar el acto");
    }
  };

  const eliminar = async (item: ActoRegistral) => {
    try {
      await axios.delete(`${API_URL}/${item.id}`);
      message.success("Acto eliminado");
      cargar();
    } catch {
      message.error("No se pudo eliminar");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1>Actos Registrales</h1>

      <Button type="primary" onClick={abrirNuevo} style={{ marginBottom: 16 }}>
        Nuevo Acto Registral
      </Button>

      <Table dataSource={actos} loading={loading} rowKey="id">
        <Table.Column title="ID" dataIndex="id" />
        <Table.Column title="Descripción" dataIndex="descripcion" />
        <Table.Column
          title="Acciones"
          render={(_, record) => (
            <Space>
              <Button size="small" onClick={() => abrirEditar(record)}>
                Editar
              </Button>
              <Popconfirm
                title="¿Eliminar?"
                onConfirm={() => eliminar(record)}
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
        title={editing ? "Editar Acto Registral" : "Nuevo Acto Registral"}
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

export default ActosRegistralesPage;
