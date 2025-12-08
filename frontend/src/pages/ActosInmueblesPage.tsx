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
  DatePicker,
  Select,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

interface ActoRegistral {
  id: number;
  descripcion: string;
}

interface Inmueble {
  id: number;
  matricula: string;
}

interface ActoInmueble {
  id: number;
  actoRegistral: ActoRegistral;
  inmueble: Inmueble;
  fechaDesde: string | null;
  fechaHasta: string | null;
  juzgado: string | null;
  expediente: string | null;
  libro: string | null;
  tomo: string | null;
  folio: string | null;
}

const API = "http://localhost:8080/api/actos-inmuebles";
const API_ACTOS = "http://localhost:8080/api/actos-registrales";
const API_INMUEBLES = "http://localhost:8080/api/inmuebles";

const ActosInmueblesPage = () => {
  const [items, setItems] = useState<ActoInmueble[]>([]);
  const [actos, setActos] = useState<ActoRegistral[]>([]);
  const [inmuebles, setInmuebles] = useState<Inmueble[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [editing, setEditing] = useState<ActoInmueble | null>(null);
  const [form] = Form.useForm();

  const cargar = async () => {
    try {
      setLoading(true);
      const [ai, a, i] = await Promise.all([
        axios.get(API),
        axios.get(API_ACTOS),
        axios.get(API_INMUEBLES),
      ]);
      setItems(ai.data);
      setActos(a.data);
      setInmuebles(i.data);
    } catch {
      message.error("Error al cargar datos");
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

  const abrirEditar = (item: ActoInmueble) => {
    setEditing(item);
    form.setFieldsValue({
      actoRegistralId: item.actoRegistral.id,
      inmuebleId: item.inmueble.id,
      fechaDesde: item.fechaDesde ? dayjs(item.fechaDesde) : null,
      fechaHasta: item.fechaHasta ? dayjs(item.fechaHasta) : null,
      juzgado: item.juzgado,
      numeroExpediente: item.expediente,
      libro: item.libro,
      tomo: item.tomo,
      folio: item.folio,
    });
    setOpenModal(true);
  };

  const guardar = async () => {
    try {
      const v = await form.validateFields();

      const payload = {
        actoRegistral: { id: v.actoRegistralId },
        inmueble: { id: v.inmuebleId },
        fechaDesde: v.fechaDesde ? v.fechaDesde.format("YYYY-MM-DD") : null,
        fechaHasta: v.fechaHasta ? v.fechaHasta.format("YYYY-MM-DD") : null,
        juzgado: v.juzgado,
        numeroExpediente: v.expediente,
        libro: v.libro,
        tomo: v.tomo,
        folio: v.folio,
      };

      if (editing) {
        await axios.put(`${API}/${editing.id}`, payload);
        message.success("Acto actualizado");
      } else {
        await axios.post(API, payload);
        message.success("Acto creado");
      }

      setOpenModal(false);
      cargar();
    } catch {
      message.error("No se pudo guardar");
    }
  };

  const eliminar = async (item: ActoInmueble) => {
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
      <h1>Actos Registrales por Inmueble</h1>

      <Button type="primary" onClick={abrirNuevo} style={{ marginBottom: 16 }}>
        Nuevo Acto en Inmueble
      </Button>

      <Table dataSource={items} loading={loading} rowKey="id">
        <Table.Column title="Acto" render={(_, r) => r.actoRegistral.descripcion} />
        <Table.Column title="Inmueble" render={(_, r) => r.inmueble.matricula} />
        <Table.Column title="Desde" dataIndex="fechaDesde" />
        <Table.Column title="Hasta" dataIndex="fechaHasta" />
        <Table.Column title="Juzgado" dataIndex="juzgado" />
		<Table.Column title="Expediente" dataIndex="numeroExpediente" />
		<Table.Column title="Libro" dataIndex="libro" />
		<Table.Column title="Tomo" dataIndex="tomo" />
		<Table.Column title="Folio" dataIndex="folio" />

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
        title={editing ? "Editar Acto" : "Nuevo Acto"}
        open={openModal}
        onOk={guardar}
        onCancel={() => setOpenModal(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item label="Acto Registral" name="actoRegistralId" rules={[{ required: true }]}>
            <Select
              options={actos.map((a) => ({ label: a.descripcion, value: a.id }))}
            />
          </Form.Item>

          <Form.Item label="Inmueble" name="inmuebleId" rules={[{ required: true }]}>
            <Select
              options={inmuebles.map((i) => ({ label: i.matricula, value: i.id }))}
            />
          </Form.Item>

          <Form.Item label="Fecha Desde" name="fechaDesde">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item label="Fecha Hasta" name="fechaHasta">
            <DatePicker format="YYYY-MM-DD" />
          </Form.Item>

          <Form.Item label="Juzgado" name="juzgado">
            <Input />
          </Form.Item>

          <Form.Item label="Expediente" name="expediente">
            <Input />
          </Form.Item>

          <Form.Item label="Libro" name="libro">
            <Input />
          </Form.Item>

          <Form.Item label="Tomo" name="tomo">
            <Input />
          </Form.Item>

          <Form.Item label="Folio" name="folio">
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ActosInmueblesPage;
