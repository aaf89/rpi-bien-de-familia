import { useEffect, useState } from "react";
import { Table } from "antd";
import axios from "axios";

interface EstadisticaBF {
  anio: number;
  departamento: string;
  cantidad: number;
}

const API_ESTADISTICAS =
"http://localhost:8080/api/actos-inmuebles/estadistica-anio-departamento";

const EstadisticasBienDeFamiliaPage = () => {
  const [data, setData] = useState<EstadisticaBF[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const cargar = async () => {
      try {
        setLoading(true);
        const res = await axios.get<[string, string, number][]>(API_ESTADISTICAS);

        // Adaptamos el array de arrays al formato que espera la tabla
        const adaptado: EstadisticaBF[] = res.data.map(
          ([anio, departamento, cantidad]) => ({
            anio: Number(anio),
            departamento,
            cantidad,
          })
        );

        setData(adaptado);
      } catch (e) {
        console.error("Error cargando estadísticas:", e);
      } finally {
        setLoading(false);
      }
    };

    cargar();
  }, []);


  const columns = [
    { title: "Año", dataIndex: "anio", key: "anio" },
    { title: "Departamento", dataIndex: "departamento", key: "departamento" },
    {
      title: "Cantidad de registraciones",
      dataIndex: "cantidad",
      key: "cantidad",
    },
  ];

  return (
    <div>
      <h1>Estadísticas de Bien de Familia</h1>
      <Table
        rowKey={(row) => `${row.anio}-${row.departamento}`}
        columns={columns}
        dataSource={data}
        loading={loading}
      />
    </div>
  );
};

export default EstadisticasBienDeFamiliaPage;
