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

interface Departamento {
  id: number;          
  codigo: string;
  descripcion: string;
}

const API_URL = "http://localhost:8080/api/departamentos";

const DepartamentosPage = () => {
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingDepartamento, setEditingDepartamento] = useState<Departamento | null>(null);
  const [form] = Form.useForm();

  const cargarDepartamentos = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Departamento[]>(API_URL);
      setDepartamentos(res.data);
    } catch (e) {
      message.error("Error al cargar los departamentos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDepartamentos();
  }, []);

  const abrirModalNuevo = () => {
    setEditingDepartamento(null);
    form.resetFields();
    setOpenModal(true);
  };

  const abrirModalEditar = (departamento: Departamento) => {
    setEditingDepartamento(departamento);
    form.setFieldsValue({
      id: departamento.id,
	  codigo: departamento.codigo,
      descripcion: departamento.descripcion,
    });
    setOpenModal(true);
  };

  const onGuardar = async () => {
    try {
      const values = await form.validateFields();

      if (editingDepartamento) {
        await axios.put(`${API_URL}/${editingDepartamento.id}`, {
          ...editingDepartamento,
          ...values,
        });
        message.success("Departamento actualizado");
      } else {
        await axios.post(API_URL, values);
        message.success("Departamento departamento");
      }

      setOpenModal(false);
      form.resetFields();
      setEditingDepartamento(null);
      cargarDepartamentos();
    } catch (e: any) {
      if (!e?.errorFields) message.error("No se pudo guardar el departamento");
    }
  };

  const onEliminar = async (departamento: Departamento) => {
    try {
      await axios.delete(`${API_URL}/${departamento.id}`);
      message.success("Departamento eliminado");
      cargarDepartamentos();
    } catch {
      message.error("No se pudo eliminar el departamento");
    }
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Departamentos</h1>

      <Button
        type="primary"
        onClick={abrirModalNuevo}
        style={{ marginBottom: 16 }}
      >
        Nueva Departamento
      </Button>

      <Table<Departamento> rowKey="id" dataSource={departamentos} loading={loading}>
	    <Table.Column<Departamento> title="Id" dataIndex="id" />
        <Table.Column<Departamento> title="Código" dataIndex="codigo" />
        <Table.Column<Departamento> title="Descripción" dataIndex="descripcion" />
        <Table.Column<Departamento>
          title="Acciones"
          render={(_, record) => (
            <Space>
              <Button size="small" onClick={() => abrirModalEditar(record)}>
                Editar
              </Button>
              <Popconfirm
                title="¿Eliminar departamento?"
                okText="Eliminar"
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
        title={editingDepartamento ? "Editar Departamento" : "Nuevo Departamento"}
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingDepartamento(null);
          form.resetFields();
        }}
        onOk={onGuardar}
        okText="Guardar"
        cancelText="Cancelar"
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Código"
            name="codigo"
            rules={[{ required: true, message: "El código es obligatorio" }]}
          >
		  	<Input />
          </Form.Item>

          <Form.Item
            label="Descripción"
            name="descripcion"
            rules={[{ required: true, message: "La descripción es obligatoria" }]}
          >
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default DepartamentosPage;
