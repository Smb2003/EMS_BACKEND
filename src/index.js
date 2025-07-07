require('dotenv').config();
const app = require('./app');
const { connect_to_database } = require('./database');
console.log(process.env.PORT);


connect_to_database()
.then(()=>{
    console.log("Connected successfully!")
}).catch(err=>{
    console.log(err);
})

app.listen(process.env.PORT || 3000,()=>{
    console.log(`Server is listening at port ${process.env.PORT}`);
});

