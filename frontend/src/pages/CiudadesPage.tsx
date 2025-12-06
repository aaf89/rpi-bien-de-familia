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

const { Option } = Select;

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

const API_CIUDADES = "http://localhost:8080/api/ciudades";
const API_DEPARTAMENTOS = "http://localhost:8080/api/departamentos";

const CiudadesPage = () => {
  const [ciudades, setCiudades] = useState<Ciudad[]>([]);
  const [departamentos, setDepartamentos] = useState<Departamento[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editingCiudad, setEditingCiudad] = useState<Ciudad | null>(null);
  const [form] = Form.useForm();

  const cargarCiudades = async () => {
    try {
      setLoading(true);
      const res = await axios.get<Ciudad[]>(API_CIUDADES);
      setCiudades(res.data);
    } catch {
      message.error("Error al cargar las ciudades");
    } finally {
      setLoading(false);
    }
  };

  const cargarDepartamentos = async () => {
    try {
      const res = await axios.get<Departamento[]>(API_DEPARTAMENTOS);
      setDepartamentos(res.data);
    } catch {
      message.error("Error al cargar los departamentos");
    }
  };

  useEffect(() => {
    cargarCiudades();
    cargarDepartamentos();
  }, []);

  const abrirModalNuevo = () => {
    setEditingCiudad(null);
    form.resetFields();
    setOpenModal(true);
  };

  const abrirModalEditar = (ciudad: Ciudad) => {
    setEditingCiudad(ciudad);
    form.setFieldsValue({
      codigo: ciudad.codigo,
      descripcion: ciudad.descripcion,
	  departamentoId: ciudad.departamento?.id    
	});
    setOpenModal(true);
  };

  const onGuardar = async () => {
    try {
      const values = await form.validateFields();

	  const payload = {
	        codigo: values.codigo,
	        descripcion: values.descripcion,
	        departamento: values.departamentoId
	          ? { id: values.departamentoId }
	          : null,
	  };
		  
      if (editingCiudad) {
        await axios.put(`${API_CIUDADES}/${editingCiudad.id}`, payload);
        message.success("Ciudad actualizada");
      } else {
        await axios.post(API_CIUDADES, payload);
        message.success("Ciudad creada");
      }

      setOpenModal(false);
      form.resetFields();
      setEditingCiudad(null);
      cargarCiudades();
    } catch (e: any) {
      if (!e?.errorFields) {
        message.error("No se pudo guardar la ciudad");
      }
    }
  };

  const onEliminar = async (ciudad: Ciudad) => {
    try {
      await axios.delete(`${API_CIUDADES}/${ciudad.id}`);
      message.success("Ciudad eliminada");
      cargarCiudades();
    } catch {
      message.error("No se pudo eliminar la ciudad");
    }
  };

  const obtenerNombreDepartamento = (ciudad: Ciudad) => {
    return ciudad.departamento?.descripcion ?? ""
  };

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ marginBottom: 16 }}>Ciudades</h1>

      <Button
        type="primary"
        onClick={abrirModalNuevo}
        style={{ marginBottom: 16 }}
      >
        Nueva Ciudad
      </Button>

      <Table<Ciudad> rowKey="id" dataSource={ciudades} loading={loading}>
        <Table.Column<Ciudad> title="ID" dataIndex="id" />
        <Table.Column<Ciudad> title="Código" dataIndex="codigo" />
        <Table.Column<Ciudad> title="Descripción" dataIndex="descripcion" />
        <Table.Column<Ciudad>
          title="Departamento"
          render={(_, record) => obtenerNombreDepartamento(record)}
        />
        <Table.Column<Ciudad>
          title="Acciones"
          render={(_, record) => (
            <Space>
              <Button size="small" onClick={() => abrirModalEditar(record)}>
                Editar
              </Button>
              <Popconfirm
                title="¿Eliminar ciudad?"
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
        title={editingCiudad ? "Editar Ciudad" : "Nueva Ciudad"}
        open={openModal}
        onCancel={() => {
          setOpenModal(false);
          setEditingCiudad(null);
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
            rules={[
              { required: true, message: "La descripción es obligatoria" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Departamento"
            name="departamentoId"
            rules={[
              {
                required: true,
                message: "El departamento es obligatorio",
              },
            ]}
          >
            <Select placeholder="Seleccione un departamento">
              {departamentos.map((dep) => (
                <Option key={dep.id} value={dep.id}>
                  {dep.descripcion}
                </Option>
              ))}
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CiudadesPage;
