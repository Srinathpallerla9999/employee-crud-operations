const express = require("express")
const router = express.Router()
const { v4: uuidv4 } = require('uuid')
const employee = require("../models/employeeDetails.mode")
const jwt = require("jsonwebtoken")
const verifyToken = require("../token_verify")


const postEmployeeDetails = (employeeDetails) => {
    const emailmatch = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employeeDetails.email);
    if (!emailmatch) {
        return { status: 400, errors: { message: "Invalid Email format" } }
    }
    try {
        let details = employee.findOne({ email: employeeDetails.email }).exec()
            .then(data => {
                if (data) {
                    return { status: 400, errors: { message: "Entered Email is already exists" } }
                }
            })
            .catch(err => {
                console.log("EMPLOYEE | DETAILS | POST | ERROR", err);
                return { status: 400, errors: { message: err } }
            })
        return details
    }
    catch (error) {
        console.log('"ROUTER | GET | INTERNAL | SERVER | ERROR"', error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
}

router.post("/employee", verifyToken, async (req, res) => {
    let employeeData = req.body
    try {
        let data = await postEmployeeDetails(employeeData)
        if (data?.status == 400) {
            return res.status(data.status).send({ errors: data.errors })
        }
        let postEmployee = new employee(employeeData)
        postEmployee.save()
            .then(data => {
                if (!data) {
                    return res.status(400).send({ errors: { message: "Could not create Employee" } })
                }
                return res.status(200).send({ data: { message: "Data added sucessfully" } })
            })
            .catch(err => {
                console.log("EMPLOYEE | ROUTE | POST | ERROR", err);
                return res.status(400).send({ errors: { message: "Could not create Employee" } })

            })
    }
    catch (error) {
        console.log('"ROUTER | POST | INTERNAL | SERVER | ERROR"', error)
        return res.status(500).json({errors: { message: 'Internal Server Error' }});
    }
})
router.get("/employees", verifyToken, async (req, res) => {
    try {
        // Pagination parameters
        // const page = parseInt(req.query.page) || 1;
        // const limit = parseInt(req.query.limit) || 10;

        // // Calculate skip value for pagination
        // const skip = (page - 1) * limit;

        // // Query the database with pagination
        // const data = await employee.find().skip(skip).limit(limit).exec();

        // // Count total number of records for pagination info
        // const totalCount = await employee.countDocuments();

        // // Calculate total number of pages
        // const totalPages = Math.ceil(totalCount / limit);

        // // Create next and previous page links
        // const nextPage = page < totalPages ? `/employees?page=${page + 1}&limit=${limit}` : null;
        // const prevPage = page > 1 ? `/employees?page=${page - 1}&limit=${limit}` : null;

         employee.find().exec()
         .then(data => {
            if(!data){
                 return res.status(400).send({errors: {message:"No employees found"}});
             }
             else {
                return res.status(201).send({data: data});

             }
         })
        // return res.status(200).json({
        //     data: {
        //         items: data,
        //         // pagination: {
        //         //     totalCount,
        //         //     totalPages,
        //         //     currentPage: page,
        //         //     nextPage,
        //         //     prevPage,
        //         // },
        //     },
        // });
    } catch (error) {
        console.log("EMPLOYEE | ROUTE | GET ALL | ERROR", error);
        return res.status(500).json({ message: 'Internal Server Error' });
    }
});

router.get('/employee', verifyToken, (req, res) => {
    let getById = req.query.id
    try {
        employee.findOne({ _id: getById })
            .then(data => {
                if (!data) {
                    return res.status(400).send({ errors: { message: "No record Found" } })
                }
                return res.status(201).send({ data: { item: data } })
            })
    }
    catch (error) {
        console.log('"ROUTER | GET BY ID | INTERNAL | SERVER | ERROR"', error)
        return res.status(500).json({ message: 'Internal Server Error' });
    }
})

router.put('/employee', verifyToken, async (req, res) => {
    const employeeId = req.query.id;
    const updatedData = req.body;

    try {
        const existingEmployee = await employee.findOne({ _id: employeeId }).exec();

        if (!existingEmployee) {
            return res.status(404).send({ errors: { message: "Employee not found" } });
        }
        let updatedObject = Object.assign(existingEmployee, updatedData);
        await updatedObject.save();
        return res.status(200).send({ data: { message: "Item updated Successfully..." } });
    } catch (err) {
        console.log("EMPLOYEE | ROUTE | PUT | ERROR", err);
        return res.status(500).send({ errors: { message: "Internal Server Error" } });
    }
});


router.delete('/employee', verifyToken, async (req, res) => {
    const employeeId = req.query.id;

    try {
        const deletedEmployee = await employee.findOneAndDelete({ _id: employeeId }).exec();

        if (!deletedEmployee) {
            return res.status(404).send({ errors: { message: "Employee not found" } });
        }

        return res.status(200).send({ data: { message: "Employee deleted successfully" } });
    } catch (err) {
        console.log("EMPLOYEE | ROUTE | DELETE | ERROR", err);
        return res.status(500).send({ errors: { message: "Internal Server Error" } });
    }
});


module.exports = router