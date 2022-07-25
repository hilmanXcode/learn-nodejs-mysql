const express = require('express');
const BodyParser = require('body-parser')
const mysql = require('mysql');
const port = 8000;

const app = express();

let testing = "Asu";

app.use(BodyParser.urlencoded({ extended: true }))

app.set("view engine", "ejs");
app.set("views", "views");

const db = mysql.createConnection({
  host: "localhost",
  database: "school",
  user: "root",
  password: "",
})

db.connect((err) => {
  if(err) throw err
  console.log('Database connected...');

  // Untuk get data
  app.get('/', (req, res) => {
    const sql = "SELECT * FROM users";
    db.query(sql, (err, result) => {
      const users = JSON.parse(JSON.stringify(result));
      res.render("index", { users: users, title: "Daftar Mahasiswa" });
    })
  })

  // app.get('/debugging', (req, res) => {
  //   const sql = "SELECT * FROM users";
  //   db.query(sql, (err, result) => {
  //     const users = JSON.parse(JSON.stringify(result));
  //     for(let user of users){
  //       console.log(user.nama);
  //       if(testing === user.nama)
  //       {
  //         console.log("MAU KEMANA KAMUUUU");
  //       }
  //     }
  //   })
  // })

  // Untuk insert data
  app.post('/tambah', (req, res) => {
    const insertSql = `INSERT INTO users (nama, kelas) VALUES ('${req.body.nama}', '${req.body.kelas}');`;
    db.query(insertSql, (err, result) => {
      if(err) throw err
      res.redirect("/");
    })
  })

  app.get('/mahasiswa/edit/:id', (req, res) => {
    const id = req.params.id;
    const selectQuery = `SELECT * FROM users WHERE id=${id}`;
    db.query(selectQuery, (err, result, field) => {
      if(err) throw err
      res.render('mahasiswaEdit', { title: 'Edit Mahasiswa', editData: result[0]});
    })
  })

  app.get('/mahasiswa/delete/:id', (req, res) => {
    const id = req.params.id;
    const deleteSql = `DELETE FROM users WHERE id=${id};`
    db.query(deleteSql, (err, result) => {
      if(err) throw err
      res.redirect('/')
    })
  })

  // app.get('/mahasiswa/delete/:id', (req, res) => {
  //   const id = req.params.id;
  //   const selectQuery = `SELECT * FROM users WHERE id=${id}`;
  //   db.query(selectQuery, (err, result) => {
  //     if(err) throw err
  //     res.render('mahasiswaDelete', { title: 'Delete Mahasiswa', deleteData: result[0] });
  //   })
  // })


  // app.post('/mahasiswa/edit/:id', (req, res) => {
  //   const getAll = 'SELECT * FROM users';
  //   db.query(getAll, (err, result) => {
  //     console.log(result.nama);
  //   })
  // })

  // Lier fix na euyyy :v
//   app.post('/mahasiswa/edit/:kelas/:id', (req, res) => {
//     const id = req.params.id;
//     const kelas = req.params.kelas;
//     const query = `SELECT nama FROM users WHERE nama='${req.body.nama}'`
//     db.query(query, (err, result) => {
//       if(result.length === 0){
//         const updateSql = `UPDATE users SET nama='${req.body.nama}', kelas='${req.body.kelas}' WHERE id=${id}`;
//         db.query(updateSql, (error, results) => {
//           res.redirect("/");
//         })
//       }
//       else if(result.length !== 0 && kelas !== req.body.kelas){
//         res.send(`Maaf, Nama ${req.body.nama} dengan kelas ${req.body.kelas} telah terdaftar di database`);
//       }
//       else {
//         const updateSqls = `UPDATE users SET nama='${req.body.nama}', kelas='${req.body.kelas}' WHERE id=${id}`;
//         db.query(updateSqls, (err, data) => {
//           res.redirect("/");
//         })
//       }
//   })
// })

  // FINAL VERSS
  app.post('/mahasiswa/edit/:id', (req, res) => {
    const id = req.params.id;
    const updateSql = `UPDATE users SET nama='${req.body.nama}', kelas='${req.body.kelas}' WHERE id=${id}`;
    db.query(updateSql, (err, result) => {
      if(err) throw err
      res.redirect('/');
    })
  })

  // app.post('/mahasiswa/edit/:id', (req, res) => {
  //   const id = req.params.id;
  //   const selectQuery = `UPDATE users SET nama='${req.body.nama}', kelas='${req.body.kelas}' WHERE id= ?`;
  //   db.query(selectQuery, [id], (err, result, field) => {
  //     const updateSql = `UPDATE users SET nama='${req.body.nama}', kelas='${req.body.kelas}' WHERE id=${req.body.id}`;
  //     db.query(updateSql, (error, results, fields) => {
  //       if(req.body.nama.length !== result[1]) {
  //         res.redirect('/');
  //         console.log(results[0])
  //       }
  //       else{
  //         res.send(`Maaf, nama ${req.body.nama} telah terdaftar di database`);
  //       }
  //     })
  //   })
  // })


})


app.listen(port, () => {
  console.log(`Server Berjalan pada port ${port}...`);
})
