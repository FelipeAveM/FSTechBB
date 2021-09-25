const express = require('express')
const compression = require('compression');
const engines = require('consolidate')
const bodyParser = require('body-parser')
const utf8 = require('utf8');
const url = require('url');
const http = require('http')
const fs = require('fs')

const port = 3000
const app = express()


/*
const server = http.createServer(function (req, res) {

    fs.readFile('app.html', function (err, htmldata) {
        if (err) {
            console.log("Error: " + err)
            res.writeHead(404)
            res.write("Error al leer archivo")
        }
        else {
            res.write(htmldata)
        }
        //res.end()
    })
    //res.write("Hi!")
    //res.end()
})

server.listen(port, function (error) {
    if (error) {
        console.log(error)
    }
    else {
        console.log("Server up on port: " + port)
    }
})
*/
//LOCAL DATABASE-------------------------------------------------------------------------------------------------------
const mysql = require('mysql');
const { json } = require('express');
const cons = require('consolidate');

//CONEXIÓN DATABASE----------------------------------------------------------------------------------------------------
const conn = mysql.createConnection({
    host: 'localhost',
    port: 3006,
    user: 'root',
    password: '',
    database: 'fstechbb',
    socketPath: '/Applications/XAMPP/xamppfiles/var/mysql/mysql.sock'
});

//app.engine('html', engines.mustache);
//app.set('view engine', 'html');
//app.use(express.static("public"));
app.use(bodyParser.json({ limit: '50mb' }));
//app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));
//app.use(compression());

/*CORS middleware
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});*/


/*LOCATION TABLE 
conn.query('SELECT * FROM Location where id = 2', (err, res, fields) =>{
    if(err){
        return console.log(err)
    }
    else{
        return console.log(res)
    }
})*/

//CREATE --------------------------------------------

app.post('/add/location', function (req, response) {
    var bodyLocation = req.body
    console.log(bodyLocation)
    if (bodyLocation != 0) {
        var location = {
            "id": bodyLocation.id,
            "name": bodyLocation.name,
            "area_m2": bodyLocation.area_m2,
            "parent_loc": bodyLocation.parent_loc,
            "internal_loc": bodyLocation.internal_loc
        }
        setLocation(location, function (res) {
            if (res.length > 0) {
                console.log('Location inserted')
                response.end()
            }
            else {
                console.log('Location not inserted : ' + res)
                response.end()
            }
        })
    }
    else {
        response.end()
    }

})

app.post('/add/internals/', function (req, response) {
    var bodyLocation = req.body
    console.log(bodyLocation)
    if (bodyLocation != 0) {
        var location = {
            "id": bodyLocation.id,
            "internal_loc": bodyLocation.internal_loc
        }
        getInternalsById(location.id, function (res) {
            if (res.length > 0) {
                console.log('Internal Locations found')
                var internal_ids = JSON.parse(res[0].internal_loc)
                console.log(location.internal_loc.length)
                if (location.internal_loc.length == 1) {
                    internal_ids = '[' + internal_ids + ',' + JSON.parse(location.internal_loc) + ']'
                    console.log(internal_ids)
                    var loc = {
                        "id": location.id,
                        "internal_loc": JSON.parse(internal_ids)
                    }
                    updateInternalsById(loc, function (res) {
                        if (res.length > 0) {
                            console.log('Location updated')
                            response.end()
                        }
                        else {
                            console.log('Location not updated : ' + res)
                            response.end()
                        }
                    })
                }
                else{
                    console.log('Error. Internal Locatinos Inserted = ' + location.internal_loc.length)
                    response.end()
                }

            }
            else {
                console.log('Internal Locations not found')
                response.end()
            }
        })
    }
    else {
        response.end()
    }
})

function setLocation(location, callback) {
    var int_locs = location.internal_loc
    if (int_locs != null) int_locs = JSON.stringify(location.internal_loc)
    conn.query('INSERT INTO LOCATION VALUES (?, ?, ?, ?, ?)',
        [location.id, location.name, location.area_m2, location.parent_loc, int_locs],
        function (error) {
            if (error) {
                callback(error)
            }
            else {
                callback("DATOS INSERTADOS")
            }
        })

}


//READ ----------------------------------------------

app.get('/get/location/:id', function (req, response) {
    var id = req.params.id
    getLocationById(id, function (res) {
        if (res.length > 0) {
            console.log('Location found')
            response.json(res[0])
        }
        else {
            console.log('Location not found')
            response.end()
        }
    })
})

app.get('/get/parent/:id', function (req, response) {
    var id = req.params.id
    getParentById(id, function (res) {
        if (res.length > 0) {
            console.log('Location found')
            var parent_id = res[0].parent_loc
            getLocationById(parent_id, function (rows) {
                if (rows.length > 0) {
                    console.log('Parent Location found')
                    response.json(rows[0])
                }
                else {
                    console.log('Parent Location not found')
                    response.json(null)
                }
            })
        }
        else {
            console.log('Location not found')
            response.end()
        }
    })
})

app.get('/get/internals/:id', function (req, response) {
    var id = req.params.id
    getInternalsById(id, function (res) {
        if (res.length > 0) {
            console.log('Internal Locations found')
            var internal_ids = JSON.parse(res[0].internal_loc)
            console.log(internal_ids)
            getLocationsById(internal_ids, function (rows) {
                if (rows.length > 0) {
                    console.log('Internal Location found')
                    response.json(rows)
                }
                else {
                    console.log('Internal Location not found')
                    response.json(null)
                }
            })
        }
        else {
            console.log('Internal Locations not found')
            response.end()
        }
    })
})

function getLocationById(id, callback) {
    console.log("Location_ID: " + id);
    var query = 'SELECT * FROM Location WHERE id = ' + id
    console.log(query)
    conn.query('SELECT * FROM Location WHERE id = ?', [id], function (error, results) {
        if (error) {
            console.log("ERROR AL OBTENER DATOS: " + error);
        }
        else {
            console.log("DATOS OBTENIDOS: " + results);
            callback(results);
        }
    })
}

function getLocationsById(id, callback) {
    console.log("Location_ID: " + id);
    var query = 'SELECT * FROM Location WHERE id in (' + id + ')'
    console.log(query)
    conn.query('SELECT * FROM Location WHERE id in ( ? )', [id], function (error, results) {
        if (error) {
            console.log("ERROR AL OBTENER DATOS: " + error);
        }
        else {
            console.log("DATOS OBTENIDOS: " + results);
            callback(results);
        }
    })
}


function getParentById(id, callback) {
    console.log("Location_ID: " + id);
    conn.query('SELECT parent_loc FROM Location WHERE id = ?', [id], function (error, results) {
        if (error) {
            console.log("ERROR AL OBTENER DATOS: " + error);
        }
        else {
            console.log("DATOS OBTENIDOS: " + results);
            callback(results);
        }
    })
}

function getInternalsById(id, callback) {
    console.log("Location_ID: " + id);
    conn.query('SELECT internal_loc FROM Location WHERE id = ?', [id], function (error, results) {
        if (error) {
            console.log("ERROR AL OBTENER DATOS: " + error);
        }
        else {
            console.log("DATOS OBTENIDOS: " + results);
            callback(results);
        }
    })
}

//UPDATE --------------------------------------------

app.post('/update/location', function (req, response) {
    var bodyLocation = req.body
    console.log(bodyLocation)
    if (bodyLocation != 0) {
        var location = {
            "id": bodyLocation.id,
            "name": bodyLocation.name,
            "area_m2": bodyLocation.area_m2,
            "parent_loc": bodyLocation.parent_loc,
            "internal_loc": bodyLocation.internal_loc
        }
        updateLocationById(location, function (res) {
            if (res.length > 0) {
                console.log('Location updated')
                response.end()
            }
            else {
                console.log('Location not updated : ' + res)
                response.end()
            }
        })
    }
    else {
        response.end()
    }

})

app.post('/update/name', function (req, response) {
    var bodyLocation = req.body
    console.log(bodyLocation)
    if (bodyLocation != 0) {
        var location = {
            "id": bodyLocation.id,
            "name": bodyLocation.name,
            "area_m2": bodyLocation.area_m2,
            "parent_loc": bodyLocation.parent_loc,
            "internal_loc": bodyLocation.internal_loc
        }
        updateNameById(location, function (res) {
            if (res.length > 0) {
                console.log('Location updated')
                response.end()
            }
            else {
                console.log('Location not updated : ' + res)
                response.end()
            }
        })
    }
    else {
        response.end()
    }

})

app.post('/update/area', function (req, response) {
    var bodyLocation = req.body
    console.log(bodyLocation)
    if (bodyLocation != 0) {
        var location = {
            "id": bodyLocation.id,
            "name": bodyLocation.name,
            "area_m2": bodyLocation.area_m2,
            "parent_loc": bodyLocation.parent_loc,
            "internal_loc": bodyLocation.internal_loc
        }
        updateAreaById(location, function (res) {
            if (res.length > 0) {
                console.log('Location updated')
                response.end()
            }
            else {
                console.log('Location not updated : ' + res)
                response.end()
            }
        })
    }
    else {
        response.end()
    }

})

app.post('/update/parent', function (req, response) {
    var bodyLocation = req.body
    console.log(bodyLocation)
    if (bodyLocation != 0) {
        var location = {
            "id": bodyLocation.id,
            "name": bodyLocation.name,
            "area_m2": bodyLocation.area_m2,
            "parent_loc": bodyLocation.parent_loc,
            "internal_loc": bodyLocation.internal_loc
        }
        updateParentById(location, function (res) {
            if (res.length > 0) {
                console.log('Location updated')
                response.end()
            }
            else {
                console.log('Location not updated : ' + res)
                response.end()
            }
        })
    }
    else {
        response.end()
    }

})

app.post('/update/internals', function (req, response) {
    var bodyLocation = req.body
    console.log(bodyLocation)
    if (bodyLocation != 0) {
        var location = {
            "id": bodyLocation.id,
            "name": bodyLocation.name,
            "area_m2": bodyLocation.area_m2,
            "parent_loc": bodyLocation.parent_loc,
            "internal_loc": bodyLocation.internal_loc
        }
        updateInternalsById(location, function (res) {
            if (res.length > 0) {
                console.log('Location updated')
                response.end()
            }
            else {
                console.log('Location not updated : ' + res)
                response.end()
            }
        })
    }
    else {
        response.end()
    }

})

function updateLocationById(location, callback) {
    var int_locs = location.internal_loc
    if (int_locs != null) int_locs = JSON.stringify(location.internal_loc)
    conn.query('UPDATE LOCATION SET name = ?, area_m2 = ?, parent_loc = ?, internal_loc =  ? WHERE id = ?',
        [location.name, location.area_m2, location.parent_loc, int_locs, location.id],
        function (error) {
            if (error) {
                callback(error)
            }
            else {
                callback("DATOS ACTUALIZADOS")
            }
        })

}

function updateNameById(location, callback) {
    conn.query('UPDATE LOCATION SET name = ? WHERE id = ?',
        [location.name, location.id],
        function (error) {
            if (error) {
                callback(error)
            }
            else {
                callback("DATOS ACTUALIZADOS")
            }
        })

}

function updateAreaById(location, callback) {
    conn.query('UPDATE LOCATION SET area_m2 = ? WHERE id = ?',
        [location.area_m2, location.id],
        function (error) {
            if (error) {
                callback(error)
            }
            else {
                callback("DATOS ACTUALIZADOS")
            }
        })

}

function updateParentById(location, callback) {
    conn.query('UPDATE LOCATION SET parent_loc = ? WHERE id = ?',
        [location.parent_loc, location.id],
        function (error) {
            if (error) {
                callback(error)
            }
            else {
                callback("DATOS ACTUALIZADOS")
            }
        })

}

function updateInternalsById(location, callback) {
    var int_locs = location.internal_loc
    if (int_locs != null) int_locs = JSON.stringify(location.internal_loc)
    conn.query('UPDATE LOCATION SET internal_loc =  ? WHERE id = ?',
        [int_locs, location.id],
        function (error) {
            if (error) {
                callback(error)
            }
            else {
                callback("DATOS ACTUALIZADOS")
            }
        })

}



//DELETE --------------------------------------------


app.post('/remove/location/:id', function (req, response) {
    var id = req.params.id
    removeLocation(id, function (res) {
        if (res.length > 0) {
            console.log(res)
            console.log('Location deleted')
            response.end()
        }
        else {
            console.log('Location not deleted : ' + res)
            response.end()
        }
    })
})

function removeLocation(id, callback) {
    conn.query('DELETE FROM LOCATION WHERE ID = ?', [id], function (error, results) {
        if (error) {
            callback(error)
        }
        else {
            callback("DATOS ELIMINADOS")
        }
    })
}

app.listen(port, () => {
    console.log("Server running on http://localhost:" + port + '/..')
})

