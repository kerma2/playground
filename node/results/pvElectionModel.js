
function createModel(data) {
    const model = {
      pages: [
        {
          background: PATH_TO_TITULAR_BACKGROUND_1,
          textElements: [
            {
              value: data.establishment.siret[0],
              x: 202,
              y: 109,
              fontSize: 9,
              charSpacing: 2.4
            },
            {
              value: data.establishment.siret[1],
              x: 230,
              y: 109,
              fontSize: 9,
              charSpacing: 2.4
            },
            {
              value: data.establishment.siret[2],
              x: 258,
              y: 109,
              fontSize: 9,
              charSpacing: 2.4
            },
            {
              value: data.establishment.siret[3],
              x: 286,
              y: 109,
              fontSize: 9,
              charSpacing: 2.4
            },
            {
              value: data.establishment.name,
              x: 156,
              y: 120,
            },
            {
              value: data.establishment.address.street,
              x: 142,
              y: 130,
              fontSize: 10,
              charSpacing: 4
            },
            {
              value: data.establishment.address.code,
              x: 150,
              y: 147,
            },
            {
              value: data.establishment.address.city,
              x: 224,
              y: 148,
            },
          ]
        }
      ]
    }
  }