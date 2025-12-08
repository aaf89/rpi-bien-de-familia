import { useEffect, useState } from "react";
import {
  Table,
  Button,
  Form,
  Modal,
  message,
  Space,
  Popconfirm,
  Select,
} from "antd";
import axios from "axios";

interface PersonasInmueblesPageProps {
  filtroInmuebleId?: number | null;
  filtroPersonaId?: number | null;
  onVolver?: () => void;
}

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
  persona?: Persona | null;
  inmueble?: Inmueble | null;
  numerador: number;
  denominador: number;
}

const API = "http://localhost:8080/api/personas-inmuebles";
const API_PERSONAS = "http://localhost:8080/api/personas";
const API_INMUEBLES = "http://localhost:8080/api/inmuebles";

const PersonasInmueblesPage: React.FC<PersonasInmueblesPageProps> = ({
  filtroInmuebleId,
  filtroPersonaId,
  onVolver,
}) => {
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
        axios.get<PI[]>(API),
        axios.get<Persona[]>(API_PERSONAS),
        axios.get<Inmueble[]>(API_INMUEBLES),
      ]);

      const cleanItems = (pi.data ?? []).filter((x): x is PI => x != null);

      let lista = cleanItems;

      if (filtroInmuebleId != null) {
        lista = lista.filter(
          (x) => x.inmueble && x.inmueble.id === filtroInmuebleId
        );
      }

      if (filtroPersonaId != null) {
        lista = lista.filter(
          (x) => x.persona && x.persona.id === filtroPersonaId
        );
      }

      setItems(lista);
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
  }, [filtroInmuebleId, filtroPersonaId]);

  const volver = () => {
     if (onVolver) {
       onVolver();
     }
   };

  const abrirNuevo = () => {
    setEditing(null);
    form.resetFields();

    const initialValues: any = {};
    if (filtroInmuebleId != null) initialValues.inmuebleId = filtroInmuebleId;
    if (filtroPersonaId != null) initialValues.personaId = filtroPersonaId;
    form.setFieldsValue(initialValues);

    setOpenModal(true);
  };

  const abrirEditar = (item: PI) => {
    setEditing(item);
    form.setFieldsValue({
      personaId: item.persona?.id,
      inmuebleId: item.inmueble?.id,
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
      form.resetFields();
      setEditing(null);
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

  const obtenerNombrePersona = (pi?: PI | null) => {
    if (!pi || !pi.persona) return "";
    return `${pi.persona.apellido}, ${pi.persona.nombre}`;
  };

  const obtenerInmuebleTexto = (pi?: PI | null) => {
    if (!pi || !pi.inmueble) return "";
    return pi.inmueble.matricula;
  };

  // IDs de personas que ya son titulares del inmueble filtrado
  const titularesPersonaIds =
    filtroInmuebleId != null
      ? items
          .filter((pi) => pi.inmueble && pi.inmueble.id === filtroInmuebleId)
          .map((pi) => pi.persona?.id)
          .filter((id): id is number => id != null)
      : [];

  // Opciones de personas (filtrando duplicados cuando hay filtroInmuebleId)
  const personaOptions = (() => {
    let lista = personas;

    if (filtroPersonaId != null) {
      // vista "Inmuebles de Persona X"
      lista = personas.filter((p) => p.id === filtroPersonaId);
    } else if (filtroInmuebleId != null) {
      // vista "Titulares del Inmueble Y"
      lista = personas.filter((p) => {
        const esTitular = titularesPersonaIds.includes(p.id);
        const esPersonaActualEnEdicion =
          editing && editing.persona && editing.persona.id === p.id;
        // permito:
        // - los que no son titulares
        // - o la persona actual en edición
        return !esTitular || esPersonaActualEnEdicion;
      });
    }

    return lista.map((p) => ({
      label: `${p.apellido}, ${p.nombre}`,
      value: p.id,
    }));
  })();

  // Opciones de inmuebles (si hay filtroInmuebleId, solo ese)
  const inmuebleOptions = (() => {
    let lista = inmuebles;
    if (filtroInmuebleId != null) {
      lista = inmuebles.filter((i) => i.id === filtroInmuebleId);
    }
    return lista.map((i) => ({
      label: i.matricula,
      value: i.id,
    }));
  })();

  return (
    <div style={{ padding: 24 }}>
      <h1>
        {filtroInmuebleId != null
          ? "Titulares del Inmueble: " + obtenerInmuebleTexto(items[0])
          : filtroPersonaId != null
          ? "Inmuebles de: " + obtenerNombrePersona(items[0])
          : "Titularidades (Persona - Inmueble)"}
      </h1>

      <Button type="primary" onClick={abrirNuevo} style={{ marginBottom: 16 }}>
        Nueva Titularidad
      </Button>
	  <Button onClick={volver} style={{ marginBottom: 16, marginRight: 8 }}>
	         Volver
	       </Button>

      <Table<PI> dataSource={items} loading={loading} rowKey="id">
        <Table.Column<PI> title="ID" dataIndex="id" />

        <Table.Column<PI>
          title="Persona"
          render={(_, r) => obtenerNombrePersona(r)}
        />

        <Table.Column<PI>
          title="Inmueble"
          render={(_, r) => obtenerInmuebleTexto(r)}
        />

        <Table.Column<PI>
          title="Parte"
          render={(_, r) => `${r.numerador}/${r.denominador}`}
        />

        <Table.Column<PI>
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
        onCancel={() => {
          setOpenModal(false);
          setEditing(null);
          form.resetFields();
        }}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            label="Persona"
            name="personaId"
            rules={[{ required: true, message: "La persona es obligatoria" }]}
          >
            <Select
              options={personaOptions}
              placeholder="Seleccione una persona"
              disabled={filtroPersonaId != null} // si venís filtrada por persona, no la dejo cambiar
            />
          </Form.Item>

          <Form.Item
            label="Inmueble"
            name="inmuebleId"
            rules={[{ required: true, message: "El inmueble es obligatorio" }]}
          >
            <Select
              options={inmuebleOptions}
              placeholder="Seleccione un inmueble"
              disabled={filtroInmuebleId != null} // si venís desde Inmuebles, queda fijo
            />
          </Form.Item>

          {/* Si en la lógica final el numerador/denominador se calculan solos,
              podés dejarlos ocultos o manejarlos en backend */}
          {/* 
          <Form.Item
            label="Numerador"
            name="numerador"
            rules={[{ required: true, message: "El numerador es obligatorio" }]}
          >
            <InputNumber min={1} />
          </Form.Item>

          <Form.Item
            label="Denominador"
            name="denominador"
            rules={[{ required: true, message: "El denominador es obligatorio" }]}
          >
            <InputNumber min={1} />
          </Form.Item>
          */}
        </Form>
      </Modal>
    </div>
  );
};

export default PersonasInmueblesPage;
