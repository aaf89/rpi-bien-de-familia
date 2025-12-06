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

interface Inmueble {
  id: number;
  matricula: string;
  nomenclaturaCatastral: string;
}

const InmueblesPage = () => {
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingInmueble, setEditingInmueble] = useState<Inmueble | null>(null);
  const [form] = Form.useForm();

  const cargarInmuebles = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Inmueble[]>(
        "http://localhost:8080/api/inmuebles"
      );
      setInmuebles(res.data);
    } catch (e) {
      message.error("Error al cargar inmuebles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarInmuebles();
  }, []);

  // Abrir modal para NUEVO
  const abrirModalNuevo = () => {
    setEditingInmueble(null);
    form.resetFields();
    setOpenModal(true);
  };

  // Abrir modal para EDITAR
  const abrirModalEditar = (inmueble: Inmueble) => {
    setEditingInmueble(inmueble);
    form.setFieldsValue({
      matricula: inmueble.matricula,
      nomenclaturaCatastral: inmueble.nomenclaturaCatastral,
    });
    setOpenModal(true);
  };

  // Guardar (crear o editar según corresponda)
  const onGuardar = async () => {
    try {
      const values = await form.validateFields();

      if (editingInmueble) {
        // EDITAR
        await axios.put(
          `http://localhost:8080/api/inmuebles/${editingInmueble.id}`,
          {
            ...editingInmueble,
            ...values,
          }
        );
        message.success("Inmueble actualizado correctamente");
      } else {
        // CREAR
        await axios.post("http://localhost:8080/api/inmuebles", values);
        message.success("Inmueble creado correctamente");
      }

      setOpenModal(false);
      form.resetFields();
      setEditingInmueble(null);
      cargarInmuebles();
    } catch (e) {
      // si falla la validación de form, no mostramos error extra
      if (!(e as any).errorFields) {
        message.error("No se pudo guardar el inmueble");
      }
    }
  };

  // Eliminar
  const onEliminar = async (inmueble: Inmueble) => {
    try {
      await axios.delete(
        `http://localhost:8080/api/inmuebles/${inmueble.id}`
      );
      message.success("Inmueble eliminado");
      cargarInmuebles();
    } catch (e) {
      message.error("No se pudo eliminar el inmueble");
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
        <Table.Column<Inmueble> title="ID" dataIndex="id" />
        <Table.Column<Inmueble> title="Matrícula" dataIndex="matricula" />
        <Table.Column<Inmueble>
          title="Nomenclatura"
          dataIndex="nomenclaturaCatastral"
        />
        <Table.Column<Inmueble>
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
            ]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default InmueblesPage;
