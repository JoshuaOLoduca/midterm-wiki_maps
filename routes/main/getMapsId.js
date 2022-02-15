module.exports = function (router, db) {

  router.get('/maps/:id', (req, res) => {

    const id = req.params.id

    const mapQueryString = `
    SELECT *
    FROM maps
    WHERE id = $1;
    `;

    const mapPlacesQueryString = `
    SELECT p.*
    FROM places p
    WHERE map_id = $1;
    `;

    db.query(mapQueryString, [id])
      .then((response) => {
        const mapDetails = response.rows[0]

        db.query(mapPlacesQueryString, [mapDetails.id])
        .then(moreResponse => {
          const moarResult = moreResponse.rows;
          if (!mapDetails) throw new Error('uhoh');

          res.render('map', {map: mapDetails, places: moarResult});
        })
      })
      .catch((err) => { if (err) {
        res.status(404).send('wrong stuff');
      }
      });
  });
};