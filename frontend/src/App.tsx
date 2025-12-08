import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import {
  HomeOutlined,
  TeamOutlined,
  EnvironmentOutlined,
  ApartmentOutlined,
} from "@ant-design/icons";

import InmueblesPage from "./pages/InmueblesPage";
import PersonasPage from "./pages/PersonasPage";
import CiudadesPage from "./pages/CiudadesPage";
import DepartamentosPage from "./pages/DepartamentosPage";
import ActosInmueblesPage from "./pages/ActosInmueblesPage";
import ActosPersonasPage from "./pages/ActosInmueblesPersonasPage";
import ActosRegistralesPage from "./pages/ActosRegistralesPage";
import PersonasInmueblesPage from "./pages/PersonasInmueblesPage";
import TiposParticipacionesPage from "./pages/TiposParticipacionesPage";

const { Header, Content, Sider, Footer } = Layout;

type MenuKey =
  | "inmuebles"
  | "personas"
  | "ciudades"
  | "departamentos"
  | "actosRegistrales"
  | "tiposParticipaciones"
  | "personasInmuebles"
  | "actosInmuebles"
  | "actosPersonas";

function App() {
  // Estado inicial por defecto
  const [selectedKey, setSelectedKey] = useState<MenuKey>("inmuebles");
  const [filtroInmuebleId, setFiltroInmuebleId] = useState<number | null>(null);

  // Al montar, intento leer lo último que guardé en localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("selectedMenuKey") as MenuKey | null;
      if (saved) {
        setSelectedKey(saved);
      }
    } catch {
      // por las dudas, no hago nada si localStorage falla
    }
  }, []);

  const handleMenuClick = (key: MenuKey) => {
    setSelectedKey(key);
    try {
      localStorage.setItem("selectedMenuKey", key);
    } catch {
      // si falla localStorage, tampoco rompemos la app
    }
  };

  const renderContent = () => {
	switch (selectedKey) {
		case "personas":
        	return <PersonasPage />;
		case "ciudades":
	        return <CiudadesPage />;
		case "departamentos":
	        return <DepartamentosPage />;
		case "actosRegistrales":
		  	return <ActosRegistralesPage />;
		case "tiposParticipaciones":
			return <TiposParticipacionesPage />;
		case "actosInmuebles":
			return <ActosInmueblesPage />;
		case "actosPersonas":
		  	return <ActosPersonasPage />;
		case "personasInmuebles":
		  return <PersonasInmueblesPage filtroInmuebleId={filtroInmuebleId} />;
		case "inmuebles":
			  return (
			    <InmueblesPage
			      onVerTitulares={(id) => {
			        setFiltroInmuebleId(id);
			        setSelectedKey("personasInmuebles");
			      }}
			    />
			  );
    }
  };

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider breakpoint="lg" collapsedWidth="0" width="230">
        <div
          style={{
            height: 100,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            color: "white",
            fontWeight: "bold",
            fontSize: 18,
            border: "1px solid rgba(255,255,255,0.3)",
            borderRadius: 8,
          }}
        >
          RPI
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={(item) => handleMenuClick(item.key as MenuKey)}
          items={[
            { key: "inmuebles", icon: <HomeOutlined />, label: "Inmuebles" },
            { key: "personas", icon: <TeamOutlined />, label: "Personas" },
			{
			      key: "separator-1",
			      disabled: true,
			      label: (
			        <div
			          style={{
			            borderTop: "1px solid rgba(255, 255, 255, 0.2)",
			            margin: "8px 0",
			          }}
			        />
			      ),
			    },            { key: "departamentos", icon: <ApartmentOutlined />, label: "Departamentos" },
			{ key: "ciudades", icon: <EnvironmentOutlined />, label: "Ciudades" },
			{ key: "actosRegistrales", icon: <ApartmentOutlined />, label: "Actos Registrales" },
			{ key: "tiposParticipaciones", icon: <ApartmentOutlined />, label: "Tipos de Participacion" },
			{
				key: "separator-2",
				disabled: true,
				label: (
					<div
					    style={{
					    borderTop: "1px solid rgba(255, 255, 255, 0.2)",
					    margin: "8px 0",
					    }}
					/>
				),
			},
			{ key: "personasInmuebles", icon: <ApartmentOutlined />, label: "Personas Inmuebles" },
			{ key: "actosInmuebles", icon: <ApartmentOutlined />, label: "Actos Inmuebles" },
			{ key: "actosPersonas", icon: <ApartmentOutlined />, label: "Actos Personas" },

          ]}
        />
      </Sider>

      <Layout>
        <Header
          style={{
            background: "#fff",
            paddingLeft: 24,
            fontSize: 20,
            fontWeight: "bold",
            display: "flex",
            alignItems: "center",
          }}
        >
          Registro de la Propiedad Inmueble – Bien de Familia
        </Header>

        <Content style={{ margin: "24px" }}>
          <div
            style={{
              background: "#fff",
              padding: 24,
              minHeight: 360,
              borderRadius: 8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
            }}
          >
            {renderContent()}
          </div>
        </Content>

        <Footer style={{ textAlign: "center" }}>
          Sistema interno para empleados – RPI
        </Footer>
      </Layout>
    </Layout>
  );
}

export default App;
