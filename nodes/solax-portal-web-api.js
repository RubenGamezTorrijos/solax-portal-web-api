  const fetch = require("node-fetch");

  module.exports = function (RED) {
    function SolaxPortalWebApiNode(config) {
      RED.nodes.createNode(this, config);
      let node = this;

      node.on("input", async function (msg) {
        let token = config.token || msg.token;
        let siteId = config.siteId || msg.siteId;
        let dataType = config.dataType || msg.dataType; // Nuevo parámetro para seleccionar 'overview' o 'inverterList'

        if (!token || !siteId || !dataType) {
          node.error("El TOKEN, el ID del sitio y el tipo de datos son obligatorios.");
          return;
        }

        // Construcción de la URL dinámica basada en la opción seleccionada
        let url;
        if (dataType === "overview") {
          url = `https://www.solax-portal.com/api/v1/site/overview/${siteId}/?token=${token}`;
        } else if (dataType === "inverterList") {
          url = `https://www.solax-portal.com/api/v1/site/inverterList/${siteId}/?token=${token}`;
        } else {
          node.error("Tipo de datos no válido.");
          return;
        }

        try {
          let response = await fetch(url);
          if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
          }

          let data = await response.json();
          msg.payload = data;
          node.send(msg);
        } catch (error) {
          node.error(error.message);
        }
      });
    }

    RED.nodes.registerType("solax-portal-web-api", SolaxPortalWebApiNode, {
      defaults: {
        token: { value: "" },
        siteId: { value: "" },
        dataType: { value: "overview" } // Establece un valor predeterminado de 'overview'
      }
    });
  };
