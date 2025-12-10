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
  Row,
  Col,
} from "antd";
import axios from "axios";
import dayjs from "dayjs";

interface ActosInmueblesPageProps {
  filtroInmuebleId?: number | null;
  onVolver?: () => void;
}

interface ActoRegistral {
  id: number;
  descripcion: string;
}

interface InmuebleDTO {
  id: number;
  matricula: string;
  nomenclaturaCatastral: string;
  cantTitulares: number;
}

interface ActoInmueble {
  id: number;
  actoRegistral: ActoRegistral;
  inmueble: InmuebleDTO;
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

const ActosInmueblesPage : React.FC<ActosInmueblesPageProps> = ({
  filtroInmuebleId,
  onVolver,
  }) => {
  const [items, setItems] = useState<ActoInmueble[]>([]);
  const [actos, setActos] = useState<ActoRegistral[]>([]);
  const [inmuebles, setInmuebles] = useState<InmuebleDTO[]>([]);
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
  }, [filtroInmuebleId]);
  
  const volver = () => {
     if (onVolver) {
       onVolver();
     }
   };
   
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
	  } catch (e: any) {
	    console.error(e); // opcional, para ver bien qué viene del backend

	    let msg = "No se pudo guardar";

	    const data = e.response?.data;

	    if (data) {
	      if (typeof data === "string") {
	        // Caso: backend devuelve solo un string
	        msg = data;
	      } else if (typeof data === "object") {
	        // Caso: backend devuelve { message: "...", ... }
	        msg = data.message || data.error || msg;
	      }
	    }

	    message.error(msg);
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

	  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
      <Button type="primary" onClick={abrirNuevo} style={{ marginBottom: 16 }}>
        Nuevo Acto en Inmueble
      </Button>
	  <Button type="primary" onClick={volver} style={{ marginBottom: 16, marginRight: 8 }}>
	 	Volver
	  </Button>
	  </div>
      <Table dataSource={items} loading={loading} rowKey="id">
        <Table.Column title="Acto" render={(_, r) => r.actoRegistral.descripcion} />
        <Table.Column title="Inmueble" render={(_, r) => r.inmueble.matricula} />
        <Table.Column title="Desde" dataIndex="fechaDesde" />
        <Table.Column title="Hasta" dataIndex="fechaHasta" />
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
		  {/* Acto registral - Por defecto solo Bien de Familia */}
		  <Form.Item
		    label="Acto registral"
		    name="actoRegistralId"
		    rules={[{ required: true, message: "El acto es obligatorio" }]}
		  >
		    <Select
			placeholder="Seleccione un Acto"
					      options={
							actos.filter(i => (i.id === 1))
							.map((i) => ({
					        label: `${i.descripcion}`,
					        value: i.id,
					      }))}
					      showSearch
					      optionFilterProp="label"
		    />
		  </Form.Item>

		  {/* Inmueble (una sola columna) */}
		  <Form.Item
		    label="Inmueble"
		    name="inmuebleId"
		    rules={[{ required: true, message: "El inmueble es obligatorio" }]}
		  >
		    <Select
		      placeholder="Seleccione un inmueble"
		      options={
				inmuebles.filter(i => (i.cantTitulares ?? 0) > 0)
				.map((i) => ({
		        label: `(${i.matricula}) - (${i.nomenclaturaCatastral})`,
		        value: i.id,
		      }))}
		      showSearch
		      optionFilterProp="label"
		    />
		  </Form.Item>


		  {/* 🔹 Fecha Desde / Fecha Hasta en la misma fila */}
		  <Row gutter={16}>
		    <Col xs={24} sm={12}>
		      <Form.Item label="Fecha Desde" name="fechaDesde" rules={[{ required: true, message: "La Fecha Desde es obligatoria" }]}
>
		        <DatePicker style={{ width: "100%" }} />
		      </Form.Item>
		    </Col>
		    <Col xs={24} sm={12}>
		      <Form.Item label="Fecha Hasta" name="fechaHasta">
		        <DatePicker style={{ width: "100%" }} />
		      </Form.Item>
		    </Col>
		  </Row>

		  {/* Expediente solo, ancho completo */}
		  <Form.Item label="Nro de expediente" name="expediente" rules={[{ required: true, message: "La Fecha Desde es obligatoria" }]}>
		    <Input />
		  </Form.Item>

		  {/* 🔹 Libro / Tomo / Folio en la misma fila */}
		  <Row gutter={16}>
		    <Col xs={24} sm={8}>
		      <Form.Item label="Libro" name="libro">
		        <Input />
		      </Form.Item>
		    </Col>
		    <Col xs={24} sm={8}>
		      <Form.Item label="Tomo" name="tomo">
		        <Input />
		      </Form.Item>
		    </Col>
		    <Col xs={24} sm={8}>
		      <Form.Item label="Folio" name="folio">
		        <Input />
		      </Form.Item>
		    </Col>
		  </Row>

		  {/* resto de campos / botones */}
		</Form>
      </Modal>
    </div>
  );
};

export default ActosInmueblesPage;
