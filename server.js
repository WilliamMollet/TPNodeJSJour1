const express = require('express');
const app = express();
const mariadb = require('mariadb');
const cors = require('cors');
require('dotenv').config();

app.use(cors());
app.use(express.json());

const pool = mariadb.createPool({
    database : process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    host: process.env.DB_HOST,
});


//////////  TECH  //////////
app.get('/technologies', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM Technologie;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});


app.get('/technologie/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM Commentaire WHERE id_technologie=?;", [req.params.id]);
        const name = await conn.query("SELECT nom FROM Technologie WHERE id=?;", [req.params.id]);
        res.send({name, rows});
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.post('/technologie', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("INSERT INTO Technologie (nom) VALUES (?);", [req.body.nom]);
        const rows = await conn.query("SELECT * FROM Technologie;", [req.body.nom]);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.put('/technologie/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("UPDATE Technologie SET nom=?WHERE id=?;", [req.body.nom, req.params.id]);
        const rows = await conn.query("SELECT * FROM Technologie;", [req.body.nom]);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.delete('/technologie/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("DELETE FROM Technologie WHERE id=?;", [req.params.id]);
        const rows = await conn.query("SELECT * FROM Technologie;", [req.body.nom]);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

//////////  USER  //////////

app.get('/users', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM Utilisateur;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.get('/user/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM Commentaire WHERE id_utilisateur=?;", [req.params.id]);
        const name = await conn.query("SELECT nom, prenom FROM Utilisateur WHERE id=?;", [req.params.id]);
        res.send({name, rows});
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});    

app.post('/user', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("INSERT INTO Utilisateur (nom, prenom, email) VALUES (?, ?, ?);", [req.body.nom, req.body.prenom, req.body.email]);
        const rows = await conn.query("SELECT * FROM Utilisateur;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.put('/user/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("UPDATE Utilisateur SET nom=?, prenom=?, email=? WHERE id=?;", [req.body.nom, req.body.prenom, req.body.email, req.params.id]);
        const rows = await conn.query("SELECT * FROM Utilisateur;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.delete('/user/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("DELETE FROM Utilisateur WHERE id=?;", [req.params.id]);
        const rows = await conn.query("SELECT * FROM Utilisateur;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

//////////  COMM  //////////

app.get('/commentaires', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM Commentaire;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.get('/commentaire/:date', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        const rows = await conn.query("SELECT * FROM Commentaire WHERE date_creation<?;", [req.params.date]);
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.post('/commentaire', async (req, res) => {
    let conn;
    let date = new Date();
    try {
        conn = await pool.getConnection();
        await conn.query("INSERT INTO Commentaire (id_utilisateur, id_technologie, commentaire, date_creation) VALUES (?, ?, ?, NOW());",
            [req.body.id_utilisateur, req.body.id_technologie, req.body.commentaire, date]);
        const rows = await conn.query("SELECT * FROM Commentaire;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.put('/commentaire/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("UPDATE Commentaire SET commentaire=?, id_technologie = ?, id_utilisateur = ? WHERE id=?;",
            [req.body.commentaire, req.body.id_technologie, req.body.id_utilisateur, req.params.id]);
        const rows = await conn.query("SELECT * FROM Commentaire;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.delete('/commentaire/:id', async (req, res) => {
    let conn;
    try {
        conn = await pool.getConnection();
        await conn.query("DELETE FROM Commentaire WHERE id=?;", [req.params.id]);
        const rows = await conn.query("SELECT * FROM Commentaire;");
        res.send(rows);
    } catch (err) {
        throw err;
    } finally {
        if (conn) return conn.end();
    }
});

app.listen(3000, () => {
    console.log('Server started on port 3000');
});

