const express = require('express');
const cors = require('cors');

const patientRoutes = require('./routes/patient.routes');
const policyRoutes = require('./routes/policy.routes');
const statsRoutes = require('./routes/stats.routes');

require('./config/dataBase');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ REQUIRED
app.use('/uploads', express.static('uploads'));

app.get('/test', (req, res) => {
    res.send('Backend is working');
});

app.use('/patients', patientRoutes);
app.use('/policies', policyRoutes);
app.use('/', statsRoutes);

app.listen(3000, () => {
    console.log('Backend server running on port 3000');
});
