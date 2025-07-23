const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Middleware to authenticate JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (token == null) return res.status(401).json({ error: 'No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user; // Attach user payload to request
    next();
  });
};

function toMySQLDateTime(date) {
  return date.toISOString().slice(0, 19).replace('T', ' ');
}

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = 'uploads/approval_documents';
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const programUpload = multer({ storage: multer.memoryStorage() }).fields([
  { name: 'centralServiceLetter', maxCount: 1 },
  { name: 'pknsApprovalLetter', maxCount: 1 },
  { name: 'programLetter', maxCount: 1 },
  { name: 'excoLetter', maxCount: 1 },
  { name: 'bankAccountManager', maxCount: 1 },
  { name: 'cordRegistrationForm', maxCount: 1 },
  { name: 'updatedDocument', maxCount: 1 },
  { name: 'signedCentralServiceLetter', maxCount: 1 },
  { name: 'signedPknsApprovalLetter', maxCount: 1 },
  { name: 'signedProgramLetter', maxCount: 1 },
  { name: 'signedExcoLetter', maxCount: 1 },
  { name: 'signedBankAccountManager', maxCount: 1 },
  { name: 'signedCordRegistrationForm', maxCount: 1 }
]);

// Middleware
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Database connection
const db = require('./config/database');

// JWT Secret from environment variable
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Nodemailer transporter setup
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT ? parseInt(process.env.EMAIL_PORT) : 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Authentication route
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
    if (error) {
      console.error('Error fetching user:', error);
      res.status(500).json({ error: 'Failed to authenticate user' });
      return;
    }

    if (results.length === 0) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    const user = results[0];

    // Compare the provided password with the hashed password in the database
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      res.status(401).json({ error: 'Invalid credentials' });
      return;
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        id: user.id,
        email: user.email,
        role: user.role 
      },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  });
});

// API Routes

// Users
app.get('/api/users', (req, res) => {
  const query = 'SELECT id, name, email, role FROM users';
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching users:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/users', async (req, res) => {
  const { name, email, password, role } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    res.status(400).json({ error: 'Name, email, and password are required' });
    return;
  }

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)';
    const values = [name, email, hashedPassword, role || 'user'];

    db.query(query, values, (error, results) => {
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ error: 'Email already exists' });
          return;
        }
        console.error('Error creating user:', error);
        res.status(500).json({ error: 'Failed to create user' });
        return;
      }

      // Return user data without password
      const newUser = {
        id: results.insertId,
        name,
        email,
        role: role || 'user'
      };
      res.status(201).json(newUser);
    });
  } catch (error) {
    console.error('Error hashing password:', error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

app.get('/api/users/current', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    db.query('SELECT id, name, email, role FROM users WHERE id = ?', [userId], (error, results) => {
      if (error) {
        console.error('Error fetching current user:', error);
        res.status(500).json({ error: 'Failed to fetch current user' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: 'Current user not found' });
        return;
      }
      res.json(results[0]);
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.put('/api/users/:id', async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  console.log(`[User Update] Received request for user ID: ${id}`);
  console.log('[User Update] Request body:', updates);

  if (Object.keys(updates).length === 0) {
    return res.status(400).json({ error: 'No update data provided' });
  }

  try {
    const updateFields = [];
    const updateValues = [];

    for (const key in updates) {
      if (key === 'password') { // Handle password separately if provided
        const hashedPassword = await bcrypt.hash(updates[key], 10);
        updateFields.push('password = ?');
        updateValues.push(hashedPassword);
      } else if (key !== 'id') { // Prevent updating the ID and add other fields
        updateFields.push(`${key} = ?`);
        updateValues.push(updates[key]);
      }
    }

    if (updateFields.length === 0) {
      return res.status(400).json({ error: 'No valid fields to update' });
    }

    const query = `UPDATE users SET ${updateFields.join(', ')} WHERE id = ?`;
    updateValues.push(id);

    db.query(query, updateValues, (error, results) => {
      console.log(`[User Update] Query executed for user ID: ${id}`);
      console.log('[User Update] DB Query Error:', error);
      console.log('[User Update] DB Query Results:', results);
      if (error) {
        if (error.code === 'ER_DUP_ENTRY') {
          res.status(400).json({ error: 'Email already exists' });
          return;
        }
        console.error('Error updating user:', error);
        res.status(500).json({ error: 'Failed to update user' });
        return;
      }

      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'User not found' });
        return;
      }

      // Fetch the updated user to return the complete, current state
      db.query('SELECT id, name, email, role FROM users WHERE id = ?', [id], (fetchError, fetchResults) => {
        if (fetchError) {
          console.error('Error fetching updated user:', fetchError);
          return res.status(500).json({ error: 'Failed to fetch updated user data' });
        }
        if (fetchResults.length > 0) {
          res.json(fetchResults[0]);
        } else {
          res.status(404).json({ error: 'User not found after update' });
        }
      });
    });
  } catch (error) {
    console.error('Error updating user:', error);
    res.status(500).json({ error: 'Failed to update user' });
  }
});

app.delete('/api/users/:id', authenticateToken, (req, res) => {
  const { id } = req.params;

  // Check if the authenticated user is an admin
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Only administrators can delete users.' });
  }

  const query = 'DELETE FROM users WHERE id = ?';

  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error deleting user:', error);
      res.status(500).json({ error: 'Failed to delete user' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.status(204).send();
  });
});

// Programs
app.get('/api/programs', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;

    let query = `
      SELECT p.*, 
             u.name as creator_name,
             u2.name as updated_by_name
      FROM programs p 
      LEFT JOIN users u ON p.created_by = u.id
      LEFT JOIN users u2 ON p.updated_by = u2.id
    `;
    let params = [];

    if (userRole === 'user') {
      query += ' WHERE p.created_by = ?';
      params = [userId];
    }

    db.query(query, params, (error, results) => {
      if (error) {
        console.error('Error fetching programs:', error);
        res.status(500).json({ error: 'Failed to fetch programs' });
        return;
      }
      res.json(results);
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.post('/api/programs', programUpload, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;

    const {
      name,
      budget,
      recipientName,
      excoLetterReferenceNo
    } = req.body;

    const program = {
      name,
      budget,
      recipient_name: recipientName,
      exco_letter_reference_no: excoLetterReferenceNo,
      status: 'draft',
      created_by: userId,
      created_at: new Date(),
      central_service_letter_path: req.files?.centralServiceLetter?.[0]?.originalname || null,
      central_service_letter_uploaded_at: req.files?.centralServiceLetter?.[0] ? new Date() : null,
      central_service_letter_blob: req.files?.centralServiceLetter?.[0]?.buffer || null,
      pkns_approval_letter_path: req.files?.pknsApprovalLetter?.[0]?.originalname || null,
      pkns_approval_letter_uploaded_at: req.files?.pknsApprovalLetter?.[0] ? new Date() : null,
      pkns_approval_letter_blob: req.files?.pknsApprovalLetter?.[0]?.buffer || null,
      program_letter_path: req.files?.programLetter?.[0]?.originalname || null,
      program_letter_uploaded_at: req.files?.programLetter?.[0] ? new Date() : null,
      program_letter_blob: req.files?.programLetter?.[0]?.buffer || null,
      exco_letter_path: req.files?.excoLetter?.[0]?.originalname || null,
      exco_letter_uploaded_at: req.files?.excoLetter?.[0] ? new Date() : null,
      exco_letter_blob: req.files?.excoLetter?.[0]?.buffer || null,
      bank_account_manager_path: req.files?.bankAccountManager?.[0]?.originalname || null,
      bank_account_manager_uploaded_at: req.files?.bankAccountManager?.[0] ? new Date() : null,
      bank_account_manager_blob: req.files?.bankAccountManager?.[0]?.buffer || null,
      cord_registration_form_path: req.files?.cordRegistrationForm?.[0]?.originalname || null,
      cord_registration_form_uploaded_at: req.files?.cordRegistrationForm?.[0] ? new Date() : null,
      cord_registration_form_blob: req.files?.cordRegistrationForm?.[0]?.buffer || null,
      updated_document_path: req.files?.updatedDocument?.[0]?.originalname || null,
      updated_document_uploaded_at: req.files?.updatedDocument?.[0] ? new Date() : null,
      updated_document_blob: req.files?.updatedDocument?.[0]?.buffer || null
    };

    db.query('INSERT INTO programs SET ?', program, (error, results) => {
      if (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ error: 'Failed to create program' });
        return;
      }
      program.id = results.insertId;
      res.status(201).json(program);
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.put('/api/programs/:id', programUpload, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const programId = req.params.id;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;

    // First check if user has permission to edit this program
    db.query('SELECT * FROM programs WHERE id = ?', [programId], (error, results) => {
      if (error) {
        console.error('Error checking program ownership:', error);
        res.status(500).json({ error: 'Failed to check program ownership' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: 'Program not found' });
        return;
      }

      const existingProgram = results[0];

      const {
        name,
        budget,
        recipientName,
        excoLetterReferenceNo
      } = req.body;

      const programUpdateData = {};
      let canProceed = true; // Flag to control whether to proceed with DB update

      if (userRole === 'admin') {
        // Admin can edit all fields
        if (typeof name !== 'undefined') programUpdateData.name = name;
        if (typeof budget !== 'undefined') programUpdateData.budget = budget;
        if (typeof recipientName !== 'undefined') programUpdateData.recipient_name = recipientName;
        if (typeof excoLetterReferenceNo !== 'undefined') programUpdateData.exco_letter_reference_no = excoLetterReferenceNo;
        if (typeof req.body.status !== 'undefined') programUpdateData.status = req.body.status;
        // Files are allowed for admin
        if (req.files?.centralServiceLetter?.[0]) {
          programUpdateData.central_service_letter_path = req.files.centralServiceLetter[0].originalname;
          programUpdateData.central_service_letter_uploaded_at = new Date();
          programUpdateData.central_service_letter_blob = req.files.centralServiceLetter[0].buffer;
        }
        if (req.files?.pknsApprovalLetter?.[0]) {
          programUpdateData.pkns_approval_letter_path = req.files.pknsApprovalLetter[0].originalname;
          programUpdateData.pkns_approval_letter_uploaded_at = new Date();
          programUpdateData.pkns_approval_letter_blob = req.files.pknsApprovalLetter[0].buffer;
        }
        if (req.files?.programLetter?.[0]) {
          programUpdateData.program_letter_path = req.files.programLetter[0].originalname;
          programUpdateData.program_letter_uploaded_at = new Date();
          programUpdateData.program_letter_blob = req.files.programLetter[0].buffer;
        }
        if (req.files?.excoLetter?.[0]) {
          programUpdateData.exco_letter_path = req.files.excoLetter[0].originalname;
          programUpdateData.exco_letter_uploaded_at = new Date();
          programUpdateData.exco_letter_blob = req.files.excoLetter[0].buffer;
        }
        if (req.files?.bankAccountManager?.[0]) {
          programUpdateData.bank_account_manager_path = req.files.bankAccountManager[0].originalname;
          programUpdateData.bank_account_manager_uploaded_at = new Date();
          programUpdateData.bank_account_manager_blob = req.files.bankAccountManager[0].buffer;
        }
        if (req.files?.cordRegistrationForm?.[0]) {
          programUpdateData.cord_registration_form_path = req.files.cordRegistrationForm[0].originalname;
          programUpdateData.cord_registration_form_uploaded_at = new Date();
          programUpdateData.cord_registration_form_blob = req.files.cordRegistrationForm[0].buffer;
        }
        if (req.files?.updatedDocument?.[0]) {
          programUpdateData.updated_document_path = req.files.updatedDocument[0].originalname;
          programUpdateData.updated_document_uploaded_at = new Date();
          programUpdateData.updated_document_blob = req.files.updatedDocument[0].buffer;
          programUpdateData.updated_by = userId;
        }

      } else if (userRole === 'user') {
        if (existingProgram.created_by !== userId) {
          canProceed = false;
          return res.status(403).json({ error: 'You do not have permission to edit this program.' });
        }
        // User can edit their own program
        if (typeof name !== 'undefined') programUpdateData.name = name;
        if (typeof budget !== 'undefined') programUpdateData.budget = budget;
        if (typeof recipientName !== 'undefined') programUpdateData.recipient_name = recipientName;
        if (typeof excoLetterReferenceNo !== 'undefined') programUpdateData.exco_letter_reference_no = excoLetterReferenceNo;
        if (typeof req.body.status !== 'undefined') programUpdateData.status = req.body.status;
        // Files are allowed for user if they created the program
        if (req.files?.centralServiceLetter?.[0]) {
          programUpdateData.central_service_letter_path = req.files.centralServiceLetter[0].originalname;
          programUpdateData.central_service_letter_uploaded_at = new Date();
          programUpdateData.central_service_letter_blob = req.files.centralServiceLetter[0].buffer;
        }
        if (req.files?.pknsApprovalLetter?.[0]) {
          programUpdateData.pkns_approval_letter_path = req.files.pknsApprovalLetter[0].originalname;
          programUpdateData.pkns_approval_letter_uploaded_at = new Date();
          programUpdateData.pkns_approval_letter_blob = req.files.pknsApprovalLetter[0].buffer;
        }
        if (req.files?.programLetter?.[0]) {
          programUpdateData.program_letter_path = req.files.programLetter[0].originalname;
          programUpdateData.program_letter_uploaded_at = new Date();
          programUpdateData.program_letter_blob = req.files.programLetter[0].buffer;
        }
        if (req.files?.excoLetter?.[0]) {
          programUpdateData.exco_letter_path = req.files.excoLetter[0].originalname;
          programUpdateData.exco_letter_uploaded_at = new Date();
          programUpdateData.exco_letter_blob = req.files.excoLetter[0].buffer;
        }
        if (req.files?.bankAccountManager?.[0]) {
          programUpdateData.bank_account_manager_path = req.files.bankAccountManager[0].originalname;
          programUpdateData.bank_account_manager_uploaded_at = new Date();
          programUpdateData.bank_account_manager_blob = req.files.bankAccountManager[0].buffer;
        }
        if (req.files?.cordRegistrationForm?.[0]) {
          programUpdateData.cord_registration_form_path = req.files.cordRegistrationForm[0].originalname;
          programUpdateData.cord_registration_form_uploaded_at = new Date();
          programUpdateData.cord_registration_form_blob = req.files.cordRegistrationForm[0].buffer;
        }
        if (req.files?.updatedDocument?.[0]) {
          programUpdateData.updated_document_path = req.files.updatedDocument[0].originalname;
          programUpdateData.updated_document_uploaded_at = new Date();
          programUpdateData.updated_document_blob = req.files.updatedDocument[0].buffer;
          programUpdateData.updated_by = userId;
        }

      } else if (userRole === 'staff_pa') {
        // staff_pa can only edit programs with status 'query'
        if (existingProgram.status !== 'query') {
          canProceed = false;
          return res.status(403).json({ error: 'You can only edit programs with status "query".' });
        }
        // staff_pa can edit the same fields as admin (except maybe files, but for now, allow same as admin)
        if (typeof name !== 'undefined') programUpdateData.name = name;
        if (typeof budget !== 'undefined') programUpdateData.budget = budget;
        if (typeof recipientName !== 'undefined') programUpdateData.recipient_name = recipientName;
        if (typeof excoLetterReferenceNo !== 'undefined') programUpdateData.exco_letter_reference_no = excoLetterReferenceNo;
        // Files are allowed for staff_pa
        if (req.files?.centralServiceLetter?.[0]) {
          programUpdateData.central_service_letter_path = req.files.centralServiceLetter[0].originalname;
          programUpdateData.central_service_letter_uploaded_at = new Date();
          programUpdateData.central_service_letter_blob = req.files.centralServiceLetter[0].buffer;
        }
        if (req.files?.pknsApprovalLetter?.[0]) {
          programUpdateData.pkns_approval_letter_path = req.files.pknsApprovalLetter[0].originalname;
          programUpdateData.pkns_approval_letter_uploaded_at = new Date();
          programUpdateData.pkns_approval_letter_blob = req.files.pknsApprovalLetter[0].buffer;
        }
        if (req.files?.programLetter?.[0]) {
          programUpdateData.program_letter_path = req.files.programLetter[0].originalname;
          programUpdateData.program_letter_uploaded_at = new Date();
          programUpdateData.program_letter_blob = req.files.programLetter[0].buffer;
        }
        if (req.files?.excoLetter?.[0]) {
          programUpdateData.exco_letter_path = req.files.excoLetter[0].originalname;
          programUpdateData.exco_letter_uploaded_at = new Date();
          programUpdateData.exco_letter_blob = req.files.excoLetter[0].buffer;
        }
        if (req.files?.bankAccountManager?.[0]) {
          programUpdateData.bank_account_manager_path = req.files.bankAccountManager[0].originalname;
          programUpdateData.bank_account_manager_uploaded_at = new Date();
          programUpdateData.bank_account_manager_blob = req.files.bankAccountManager[0].buffer;
        }
        if (req.files?.cordRegistrationForm?.[0]) {
          programUpdateData.cord_registration_form_path = req.files.cordRegistrationForm[0].originalname;
          programUpdateData.cord_registration_form_uploaded_at = new Date();
          programUpdateData.cord_registration_form_blob = req.files.cordRegistrationForm[0].buffer;
        }
        if (req.files?.updatedDocument?.[0]) {
          programUpdateData.updated_document_path = req.files.updatedDocument[0].originalname;
          programUpdateData.updated_document_uploaded_at = new Date();
          programUpdateData.updated_document_blob = req.files.updatedDocument[0].buffer;
          programUpdateData.updated_by = userId;
        }

      } else {
        // Any other role is unauthorized
        canProceed = false;
        return res.status(403).json({ error: 'Unauthorized role.' });
      }

      if (!canProceed) {
          return; // Exit if an error response was already sent
      }

      const performUpdate = () => {
        // Only proceed with update if there's actual data to update
        if (Object.keys(programUpdateData).length === 0) {
            return res.status(400).json({ error: 'No valid data provided for update.' });
        }

        db.query('UPDATE programs SET ? WHERE id = ?', [programUpdateData, programId], (error, results) => {
          if (error) {
            console.error('Error updating program:', error);
            res.status(500).json({ error: 'Failed to update program' });
            return;
          }
          if (results.affectedRows === 0) {
            res.status(404).json({ error: 'Program not found or no changes made' });
            return;
          }
          // Fetch the updated program details to return the current state, including creator_name
          db.query(`
              SELECT p.*, 
                     u.name as creator_name,
                     u2.name as updated_by_name
              FROM programs p
              LEFT JOIN users u ON p.created_by = u.id
              LEFT JOIN users u2 ON p.updated_by = u2.id
              WHERE p.id = ?
            `, [programId], (fetchError, fetchResults) => {
            if (fetchError) {
              console.error('Error fetching updated program:', fetchError);
              return res.status(500).json({ error: 'Failed to fetch updated program data' });
            }
            if (fetchResults.length > 0) {
              res.json(fetchResults[0]); // Return the complete updated program object
            } else {
              res.status(404).json({ error: 'Program not found after update' });
            }
          });
        });
      };

      const documentTypes = {
        centralServiceLetter: { blob: 'central_service_letter_blob', path: 'central_service_letter_path', uploaded_at: 'central_service_letter_uploaded_at'},
        pknsApprovalLetter: { blob: 'pkns_approval_letter_blob', path: 'pkns_approval_letter_path', uploaded_at: 'pkns_approval_letter_uploaded_at'},
        programLetter: { blob: 'program_letter_blob', path: 'program_letter_path', uploaded_at: 'program_letter_uploaded_at'},
        excoLetter: { blob: 'exco_letter_blob', path: 'exco_letter_path', uploaded_at: 'exco_letter_uploaded_at'},
        bankAccountManager: { blob: 'bank_account_manager_blob', path: 'bank_account_manager_path', uploaded_at: 'bank_account_manager_uploaded_at'},
        cordRegistrationForm: { blob: 'cord_registration_form_blob', path: 'cord_registration_form_path', uploaded_at: 'cord_registration_form_uploaded_at'},
        updatedDocument: { blob: 'updated_document_blob', path: 'updated_document_path', uploaded_at: 'updated_document_uploaded_at'}
      };
      const historyPromises = [];

      for(const [type, cols] of Object.entries(documentTypes)) {
          if(req.files?.[type]?.[0] && (existingProgram[cols.blob] || existingProgram[cols.path])) {
              const promise = new Promise((resolve, reject) => {
                  const uploaderId = existingProgram.updated_by || existingProgram.created_by;
                  db.query('SELECT name FROM users WHERE id = ?', [uploaderId], (err, userResults) => {
                      if (err) {
                          return reject(err);
                      }
                      const userName = userResults.length > 0 ? userResults[0].name : 'Unknown';
                      
                      const historyEntry = {
                          program_id: programId,
                          document_type: type,
                          file_name: existingProgram[cols.path],
                          file_blob: existingProgram[cols.blob],
                          uploaded_by: uploaderId,
                          uploaded_at: existingProgram[cols.uploaded_at] || existingProgram.updated_at,
                          user_name: userName
                      };

                      db.query('INSERT INTO program_document_history SET ?', historyEntry, (err, insertResult) => {
                          if (err) {
                              return reject(err);
                          }
                          resolve(insertResult);
                      });
                  });
              });
              historyPromises.push(promise);
          }
      }
      
      if (historyPromises.length > 0) {
          Promise.all(historyPromises)
              .then(performUpdate)
              .catch(err => {
                  console.error('Failed to save document history:', err);
                  res.status(500).json({ error: 'Failed to process document history.' });
              });
      } else {
          performUpdate();
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.delete('/api/programs/:id', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const programId = req.params.id;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;

    // First check if user has permission to delete this program
    db.query('SELECT created_by FROM programs WHERE id = ?', [programId], (error, results) => {
      if (error) {
        console.error('Error checking program ownership:', error);
        res.status(500).json({ error: 'Failed to check program ownership' });
        return;
      }

      if (results.length === 0) {
        res.status(404).json({ error: 'Program not found' });
        return;
      }

      if (userRole !== 'admin' && results[0].created_by !== userId) {
        res.status(403).json({ error: 'You do not have permission to delete this program' });
        return;
      }

      db.query('DELETE FROM programs WHERE id = ?', [programId], (error, results) => {
        if (error) {
          console.error('Error deleting program:', error);
          res.status(500).json({ error: 'Failed to delete program' });
          return;
        }
        res.json({ message: 'Program deleted successfully' });
      });
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

// Payments
app.get('/api/payments', (req, res) => {
  db.query('SELECT * FROM payments', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    res.json(results);
  });
});

app.post('/api/payments', (req, res) => {
  const { amount, description, date } = req.body;
  db.query(
    'INSERT INTO payments (amount, description, date) VALUES (?, ?, ?)',
    [amount, description, date],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json({ id: results.insertId, amount, description, date });
    }
  );
});

// Approval Workflow Endpoints
app.get('/api/approvals', (req, res) => {
  db.query('SELECT * FROM approval_requests', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const formattedResults = results.map(request => ({
      ...request,
      created_at: request.created_at ? new Date(request.created_at).toISOString() : null,
      program_id: request.program_id,
      program_name: request.program_name,
    }));
    res.json(formattedResults);
  });
});

app.post('/api/approvals', (req, res) => {
  const { programId, programName, status } = req.body;
  // Default to 'under_review_finance' if not provided
  const newStatus = status === 'under_review_mmk' ? 'under_review_mmk' : 'under_review_finance';
  db.query(
    'UPDATE programs SET status = ? WHERE id = ?',
    [newStatus, programId],
    (err, updateResults) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      // Then, insert the approval request as before
      db.query(
        'INSERT INTO approval_requests (program_id, program_name, status) VALUES (?, ?, ?)',
        [programId, programName, status],
        (err, results) => {
          if (err) {
            res.status(500).json({ error: err.message });
            return;
          }
          res.json({ id: results.insertId, programId, programName, status });
        }
      );
    }
  );
});

app.put('/api/approvals/:id', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  db.query(
    'UPDATE approval_requests SET status = ? WHERE id = ?',
    [status, id],
    (err, results) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      if (results.affectedRows === 0) {
        res.status(404).json({ error: 'Approval request not found' });
        return;
      }
      res.json({ id, status });
    }
  );
});

// Remarks API Endpoints
app.get('/api/programs/:id/remarks', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT r.*, u.name as user_name, u.role as user_role 
    FROM remarks r 
    JOIN users u ON r.user_id = u.id 
    WHERE r.program_id = ? 
    ORDER BY r.created_at DESC
  `;
  
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error fetching remarks:', error);
      res.status(500).json({ error: 'Failed to fetch remarks' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/programs/:id/remarks', (req, res) => {
  const { id } = req.params;
  const { remark, userId } = req.body;

  if (!remark || !userId) {
    res.status(400).json({ error: 'Remark and userId are required' });
    return;
  }

  const query = 'INSERT INTO remarks (program_id, user_id, remark) VALUES (?, ?, ?)';
  db.query(query, [id, userId, remark], (error, results) => {
    if (error) {
      console.error('Error adding remark:', error);
      res.status(500).json({ error: 'Failed to add remark' });
      return;
    }

    // Fetch the newly created remark with user details
    const fetchQuery = `
      SELECT r.*, u.name as user_name, u.role as user_role 
      FROM remarks r 
      JOIN users u ON r.user_id = u.id 
      WHERE r.id = ?
    `;
    
    db.query(fetchQuery, [results.insertId], (fetchError, fetchResults) => {
      if (fetchError) {
        console.error('Error fetching new remark:', fetchError);
        res.status(500).json({ error: 'Failed to fetch new remark' });
        return;
      }
      res.status(201).json(fetchResults[0]);
    });
  });
});

// Add a new endpoint to serve BLOBs as files:
app.get('/api/programs/:id/document/:type', (req, res) => {
  const { id, type } = req.params;
  const column = {
    centralServiceLetter: 'central_service_letter_blob',
    pknsApprovalLetter: 'pkns_approval_letter_blob',
    programLetter: 'program_letter_blob',
    excoLetter: 'exco_letter_blob',
    bankAccountManager: 'bank_account_manager_blob',
    cordRegistrationForm: 'cord_registration_form_blob',
    updatedDocument: 'updated_document_blob'
  }[type];
  if (!column) return res.status(400).send('Invalid document type');

  db.query(`SELECT ${column} FROM programs WHERE id = ?`, [id], (err, results) => {
    if (err || !results.length) return res.status(404).send('Not found');
    const fileBuffer = results[0][column];
    if (!fileBuffer) return res.status(404).send('No file');
    res.set('Content-Type', 'application/pdf'); // or detect type
    res.send(fileBuffer);
  });
});

app.get('/api/document-history/:historyId', (req, res) => {
  const { historyId } = req.params;
  const query = 'SELECT file_name, file_blob FROM program_document_history WHERE id = ?';
  db.query(query, [historyId], (err, results) => {
    if (err || !results.length) return res.status(404).send('Not found');
    const fileBuffer = results[0].file_blob;
    if (!fileBuffer) return res.status(404).send('No file');
    res.set('Content-Type', 'application/pdf'); // or detect type from file_name
    res.set('Content-Disposition', `attachment; filename="${results[0].file_name}"`);
    res.send(fileBuffer);
  });
});

app.get('/api/programs/:programId/documents/:documentType/history', (req, res) => {
  const { programId, documentType } = req.params;
  const query = `
    SELECT id, file_name, uploaded_at, user_name 
    FROM program_document_history
    WHERE program_id = ? AND document_type = ?
    ORDER BY uploaded_at DESC
  `;
  db.query(query, [programId, documentType], (error, results) => {
    if (error) {
      console.error('Error fetching document history:', error);
      res.status(500).json({ error: 'Failed to fetch document history' });
      return;
    }
    res.json(results);
  });
});

// Signed Documents API Endpoints
app.get('/api/programs/:id/signed-documents', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT sd.*, u.name as created_by_name
    FROM signed_documents sd
    LEFT JOIN users u ON sd.created_by = u.id
    WHERE sd.program_id = ?
  `;
  
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error fetching signed documents:', error);
      res.status(500).json({ error: 'Failed to fetch signed documents' });
      return;
    }
    res.json(results.length > 0 ? results[0] : null);
  });
});

app.post('/api/programs/:id/signed-documents', programUpload, (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  const programId = req.params.id;

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;
    const userRole = decoded.role;

    if (userRole !== 'staff_finance') {
      return res.status(403).json({ error: 'Only staff_finance can upload signed documents' });
    }

    const signedDocument = {
      program_id: programId,
      created_by: userId,
      signed_central_service_letter_path: req.files?.signedCentralServiceLetter?.[0]?.originalname || null,
      signed_central_service_letter_uploaded_at: req.files?.signedCentralServiceLetter?.[0] ? new Date() : null,
      signed_central_service_letter_blob: req.files?.signedCentralServiceLetter?.[0]?.buffer || null,
      signed_pkns_approval_letter_path: req.files?.signedPknsApprovalLetter?.[0]?.originalname || null,
      signed_pkns_approval_letter_uploaded_at: req.files?.signedPknsApprovalLetter?.[0] ? new Date() : null,
      signed_pkns_approval_letter_blob: req.files?.signedPknsApprovalLetter?.[0]?.buffer || null,
      signed_program_letter_path: req.files?.signedProgramLetter?.[0]?.originalname || null,
      signed_program_letter_uploaded_at: req.files?.signedProgramLetter?.[0] ? new Date() : null,
      signed_program_letter_blob: req.files?.signedProgramLetter?.[0]?.buffer || null,
      signed_exco_letter_path: req.files?.signedExcoLetter?.[0]?.originalname || null,
      signed_exco_letter_uploaded_at: req.files?.signedExcoLetter?.[0] ? new Date() : null,
      signed_exco_letter_blob: req.files?.signedExcoLetter?.[0]?.buffer || null,
      signed_bank_account_manager_path: req.files?.signedBankAccountManager?.[0]?.originalname || null,
      signed_bank_account_manager_uploaded_at: req.files?.signedBankAccountManager?.[0] ? new Date() : null,
      signed_bank_account_manager_blob: req.files?.signedBankAccountManager?.[0]?.buffer || null,
      signed_cord_registration_form_path: req.files?.signedCordRegistrationForm?.[0]?.originalname || null,
      signed_cord_registration_form_uploaded_at: req.files?.signedCordRegistrationForm?.[0] ? new Date() : null,
      signed_cord_registration_form_blob: req.files?.signedCordRegistrationForm?.[0]?.buffer || null
    };

    // Check if signed documents already exist for this program
    db.query('SELECT id FROM signed_documents WHERE program_id = ?', [programId], (error, results) => {
      if (error) {
        console.error('Error checking existing signed documents:', error);
        res.status(500).json({ error: 'Failed to check existing signed documents' });
        return;
      }

      if (results.length > 0) {
        // Update existing record
        db.query('UPDATE signed_documents SET ? WHERE program_id = ?', [signedDocument, programId], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating signed documents:', updateError);
            res.status(500).json({ error: 'Failed to update signed documents' });
            return;
          }
          res.json({ message: 'Signed documents updated successfully', id: results[0].id });
        });
      } else {
        // Create new record
        db.query('INSERT INTO signed_documents SET ?', signedDocument, (insertError, insertResults) => {
          if (insertError) {
            console.error('Error creating signed documents:', insertError);
            res.status(500).json({ error: 'Failed to create signed documents' });
            return;
          }
          signedDocument.id = insertResults.insertId;
          res.status(201).json(signedDocument);
        });
      }
    });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

app.get('/api/programs/:id/signed-document/:type', (req, res) => {
  const { id, type } = req.params;
  const column = {
    signedCentralServiceLetter: 'signed_central_service_letter_blob',
    signedPknsApprovalLetter: 'signed_pkns_approval_letter_blob',
    signedProgramLetter: 'signed_program_letter_blob',
    signedExcoLetter: 'signed_exco_letter_blob',
    signedBankAccountManager: 'signed_bank_account_manager_blob',
    signedCordRegistrationForm: 'signed_cord_registration_form_blob'
  }[type];
  
  if (!column) return res.status(400).send('Invalid document type');

  db.query(`SELECT ${column} FROM signed_documents WHERE program_id = ?`, [id], (err, results) => {
    if (err || !results.length) return res.status(404).send('Not found');
    const fileBuffer = results[0][column];
    if (!fileBuffer) return res.status(404).send('No file');
    res.set('Content-Type', 'application/pdf'); // or detect type
    res.send(fileBuffer);
  });
});

app.get('/api/user-program-summary', authenticateToken, (req, res) => {
  if (req.user.role !== 'admin' && req.user.role !== 'staff_finance') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  let query;
  if (req.user.role === 'admin') {
    query = `
      SELECT 
        u.id, u.name, u.email,
        COUNT(p.id) as total,
        SUM(p.status = 'completed') as completed,
        SUM(p.status != 'completed') as pending
      FROM users u
      LEFT JOIN programs p ON p.created_by = u.id
      GROUP BY u.id
    `;
  } else if (req.user.role === 'staff_finance') {
    query = `
      SELECT 
        u.id, u.name, u.email,
        SUM(p.status = 'under_review_finance' OR p.status = 'under_review_mmk') as total,
        SUM(p.status = 'completed') as completed,
        SUM(p.status = 'under_review_finance' OR p.status = 'under_review_mmk') as pending
      FROM users u
      LEFT JOIN programs p ON p.created_by = u.id
      GROUP BY u.id
    `;
  }
  db.query(query, (error, results) => {
    if (error) {
      console.error('Error fetching user program summary:', error);
      return res.status(500).json({ error: 'Failed to fetch summary' });
    }
    res.json(results);
  });
});

// Add endpoints for staff_finance to approve or query a program
app.post('/api/programs/:id/approve', authenticateToken, (req, res) => {
  if (req.user.role !== 'staff_finance') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const programId = req.params.id;
  
  // Check if signed documents exist for this program
  db.query('SELECT id FROM signed_documents WHERE program_id = ?', [programId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to check signed documents' });
    }
    
    if (results.length === 0) {
      return res.status(400).json({ error: 'Signed documents must be uploaded before approval' });
    }
    
    // Check if at least one signed document exists
    db.query('SELECT * FROM signed_documents WHERE program_id = ?', [programId], (docErr, docResults) => {
      if (docErr) {
        return res.status(500).json({ error: 'Failed to fetch signed documents' });
      }
      
      const signedDoc = docResults[0];
      const hasSignedDocuments = signedDoc.signed_central_service_letter_blob || 
                                signedDoc.signed_pkns_approval_letter_blob || 
                                signedDoc.signed_program_letter_blob || 
                                signedDoc.signed_exco_letter_blob || 
                                signedDoc.signed_bank_account_manager_blob || 
                                signedDoc.signed_cord_registration_form_blob;
      
      if (!hasSignedDocuments) {
        return res.status(400).json({ error: 'At least one signed document must be uploaded before approval' });
      }
      
      // Proceed with approval
      db.query('UPDATE programs SET status = ? WHERE id = ?', ['completed', programId], (updateErr, result) => {
        if (updateErr) {
          return res.status(500).json({ error: 'Failed to approve program' });
        }
        res.json({ success: true });
      });
    });
  });
});

app.post('/api/programs/:id/query', authenticateToken, (req, res) => {
  if (req.user.role !== 'staff_finance') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const programId = req.params.id;
  db.query('UPDATE programs SET status = ? WHERE id = ?', ['query', programId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to set program to query' });
    }
    res.json({ success: true });
  });
});

app.post('/api/programs/:id/reject', authenticateToken, (req, res) => {
  if (req.user.role !== 'staff_finance') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const programId = req.params.id;
  db.query('UPDATE programs SET status = ? WHERE id = ?', ['rejected', programId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to reject program' });
    }
    res.json({ success: true });
  });
});

// Add endpoint for staff_mmk to approve a program
app.post('/api/programs/:id/approve-mmk', authenticateToken, (req, res) => {
  if (req.user.role !== 'staff_mmk') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const programId = req.params.id;
  db.query('UPDATE programs SET status = ? WHERE id = ?', ['approved_by_mmk_office', programId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to approve program by MMK office' });
    }
    res.json({ success: true });
  });
});

// Allow staff_mmk to reject as well (reuse existing reject endpoint, or add role check)
app.post('/api/programs/:id/reject-mmk', authenticateToken, (req, res) => {
  if (req.user.role !== 'staff_mmk') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const programId = req.params.id;
  db.query('UPDATE programs SET status = ? WHERE id = ?', ['rejected', programId], (err, result) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to reject program by MMK office' });
    }
    res.json({ success: true });
  });
});

// Queries API Endpoints
app.get('/api/programs/:id/queries', (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT q.*, 
           u1.name as created_by_name, u1.role as created_by_role,
           u2.name as answered_by_name, u2.role as answered_by_role
    FROM queries q
    LEFT JOIN users u1 ON q.created_by = u1.id
    LEFT JOIN users u2 ON q.answered_by = u2.id
    WHERE q.program_id = ?
    ORDER BY q.created_at DESC
  `;
  
  db.query(query, [id], (error, results) => {
    if (error) {
      console.error('Error fetching queries:', error);
      res.status(500).json({ error: 'Failed to fetch queries' });
      return;
    }
    res.json(results);
  });
});

app.post('/api/programs/:id/queries', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { query_text } = req.body;
  const userId = req.user.id;

  if (!query_text || !query_text.trim()) {
    res.status(400).json({ error: 'Query text is required' });
    return;
  }

  // Start a transaction to ensure both query creation and program status update happen together
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      res.status(500).json({ error: 'Failed to create query' });
      return;
    }

    const query = 'INSERT INTO queries (program_id, query_text, created_by) VALUES (?, ?, ?)';
    db.query(query, [id, query_text.trim(), userId], (error, results) => {
      if (error) {
        console.error('Error creating query:', error);
        return db.rollback(() => {
          res.status(500).json({ error: 'Failed to create query' });
        });
      }

      // Update program status to 'query' when staff_finance adds a query
      if (req.user.role === 'staff_finance') {
        db.query('UPDATE programs SET status = ? WHERE id = ?', ['query', id], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating program status:', updateError);
            return db.rollback(() => {
              res.status(500).json({ error: 'Failed to update program status' });
            });
          }

          // Commit the transaction
          db.commit((commitError) => {
            if (commitError) {
              console.error('Error committing transaction:', commitError);
              return db.rollback(() => {
                res.status(500).json({ error: 'Failed to commit transaction' });
              });
            }

            // Fetch the newly created query with user details
            const fetchQuery = `
              SELECT q.*, 
                     u1.name as created_by_name, u1.role as created_by_role,
                     u2.name as answered_by_name, u2.role as answered_by_role
              FROM queries q
              LEFT JOIN users u1 ON q.created_by = u1.id
              LEFT JOIN users u2 ON q.answered_by = u2.id
              WHERE q.id = ?
            `;
            
            db.query(fetchQuery, [results.insertId], (fetchError, fetchResults) => {
              if (fetchError) {
                console.error('Error fetching new query:', fetchError);
                res.status(500).json({ error: 'Failed to fetch new query' });
                return;
              }
              res.status(201).json(fetchResults[0]);
            });
          });
        });
      } else {
        // For non-staff_finance users, just commit without updating program status
        db.commit((commitError) => {
          if (commitError) {
            console.error('Error committing transaction:', commitError);
            return db.rollback(() => {
              res.status(500).json({ error: 'Failed to commit transaction' });
            });
          }

          // Fetch the newly created query with user details
          const fetchQuery = `
            SELECT q.*, 
                   u1.name as created_by_name, u1.role as created_by_role,
                   u2.name as answered_by_name, u2.role as answered_by_role
            FROM queries q
            LEFT JOIN users u1 ON q.created_by = u1.id
            LEFT JOIN users u2 ON q.answered_by = u2.id
            WHERE q.id = ?
          `;
          
          db.query(fetchQuery, [results.insertId], (fetchError, fetchResults) => {
            if (fetchError) {
              console.error('Error fetching new query:', fetchError);
              res.status(500).json({ error: 'Failed to fetch new query' });
              return;
            }
            res.status(201).json(fetchResults[0]);
          });
        });
      }
    });
  });
});

app.put('/api/queries/:id/answer', authenticateToken, (req, res) => {
  const { id } = req.params;
  const { answer_text } = req.body;
  const userId = req.user.id;

  if (req.user.role !== 'staff_pa') {
    return res.status(403).json({ error: 'Only staff_pa can answer queries' });
  }

  if (!answer_text || !answer_text.trim()) {
    res.status(400).json({ error: 'Answer text is required' });
    return;
  }

  // Start a transaction to ensure both query update and program status update happen together
  db.beginTransaction((err) => {
    if (err) {
      console.error('Error starting transaction:', err);
      res.status(500).json({ error: 'Failed to answer query' });
      return;
    }

    // First, get the program_id from the query
    db.query('SELECT program_id FROM queries WHERE id = ?', [id], (queryError, queryResults) => {
      if (queryError) {
        console.error('Error fetching query:', queryError);
        return db.rollback(() => {
          res.status(500).json({ error: 'Failed to fetch query' });
        });
      }

      if (queryResults.length === 0) {
        return db.rollback(() => {
          res.status(404).json({ error: 'Query not found' });
        });
      }

      const programId = queryResults[0].program_id;

      // Update the query
      const query = 'UPDATE queries SET answer_text = ?, answered_by = ?, answered_at = ?, status = ? WHERE id = ?';
      db.query(query, [answer_text.trim(), userId, new Date(), 'answered', id], (error, results) => {
        if (error) {
          console.error('Error answering query:', error);
          return db.rollback(() => {
            res.status(500).json({ error: 'Failed to answer query' });
          });
        }

        if (results.affectedRows === 0) {
          return db.rollback(() => {
            res.status(404).json({ error: 'Query not found' });
          });
        }

        // Update program status to 'query_answered'
        db.query('UPDATE programs SET status = ? WHERE id = ?', ['query_answered', programId], (updateError, updateResults) => {
          if (updateError) {
            console.error('Error updating program status:', updateError);
            return db.rollback(() => {
              res.status(500).json({ error: 'Failed to update program status' });
            });
          }

          // Commit the transaction
          db.commit((commitError) => {
            if (commitError) {
              console.error('Error committing transaction:', commitError);
              return db.rollback(() => {
                res.status(500).json({ error: 'Failed to commit transaction' });
              });
            }

            // Fetch the updated query with user details
            const fetchQuery = `
              SELECT q.*, 
                     u1.name as created_by_name, u1.role as created_by_role,
                     u2.name as answered_by_name, u2.role as answered_by_role
              FROM queries q
              LEFT JOIN users u1 ON q.created_by = u1.id
              LEFT JOIN users u2 ON q.answered_by = u2.id
              WHERE q.id = ?
            `;
            
            db.query(fetchQuery, [id], (fetchError, fetchResults) => {
              if (fetchError) {
                console.error('Error fetching updated query:', fetchError);
                res.status(500).json({ error: 'Failed to fetch updated query' });
                return;
              }
              res.json(fetchResults[0]);
            });
          });
        });
      });
    });
  });
});

app.put('/api/queries/:id/resolve', authenticateToken, (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  if (req.user.role !== 'staff_finance') {
    return res.status(403).json({ error: 'Only staff_finance can resolve queries' });
  }

  const query = 'UPDATE queries SET status = ?, resolved_at = ? WHERE id = ?';
  db.query(query, ['resolved', new Date(), id], (error, results) => {
    if (error) {
      console.error('Error resolving query:', error);
      res.status(500).json({ error: 'Failed to resolve query' });
      return;
    }

    if (results.affectedRows === 0) {
      res.status(404).json({ error: 'Query not found' });
      return;
    }

    res.json({ success: true });
  });
});

// Final Approval: staff_finance sets program to 'approved' and records payment
app.post('/api/programs/:id/final-approve', authenticateToken, (req, res) => {
  if (req.user.role !== 'staff_finance') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  const programId = req.params.id;
  const { voucher_number, eft_number } = req.body;
  const userId = req.user.id;

  if (!voucher_number || !eft_number) {
    return res.status(400).json({ error: 'Voucher number and EFT number are required' });
  }

  // Insert payment and update program status in a transaction
  db.beginTransaction((err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to start transaction' });
    }
    db.query(
      'INSERT INTO payments (program_id, voucher_number, eft_number, user_id) VALUES (?, ?, ?, ?)',
      [programId, voucher_number, eft_number, userId],
      (payErr, payResult) => {
        if (payErr) {
          return db.rollback(() => {
            res.status(500).json({ error: 'Failed to save payment' });
          });
        }
        db.query(
          'UPDATE programs SET status = ? WHERE id = ?',
          ['approved', programId],
          (progErr, progResult) => {
            if (progErr) {
              return db.rollback(() => {
                res.status(500).json({ error: 'Failed to update program status' });
              });
            }
            db.commit((commitErr) => {
              if (commitErr) {
                return db.rollback(() => {
                  res.status(500).json({ error: 'Failed to commit transaction' });
                });
              }
              res.json({ success: true });
            });
          }
        );
      }
    );
  });
});

// Forgot Password Endpoint
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }
  db.query('SELECT id FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      console.error('Error finding user for password reset:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) {
      // For security, do not reveal if email exists
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }
    const userId = results[0].id;
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hour from now
    db.query(
      'INSERT INTO password_resets (user_id, token, expires_at) VALUES (?, ?, ?)',
      [userId, token, expiresAt],
      (err2) => {
        if (err2) {
          console.error('Error saving password reset token:', err2);
          return res.status(500).json({ error: 'Server error' });
        }
        // Send email with reset link
        const resetLink = `http://localhost:3000/reset-password?token=${token}`;
        const mailOptions = {
          from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
          to: email,
          subject: 'Password Reset Request',
          html: `<p>You requested a password reset for your account.</p><p>Click the link below to reset your password:</p><p><a href="${resetLink}">${resetLink}</a></p><p>If you did not request this, you can ignore this email.</p>`
        };
        transporter.sendMail(mailOptions, (err3, info) => {
          if (err3) {
            console.error('Error sending password reset email:', err3);
            // Still return generic message for security
          }
          res.json({ message: 'If that email exists, a reset link has been sent.' });
        });
      }
    );
  });
});

// Reset Password Endpoint
app.post('/api/reset-password', async (req, res) => {
  const { token, password } = req.body;
  if (!token || !password) {
    return res.status(400).json({ error: 'Token and new password are required' });
  }
  db.query('SELECT * FROM password_resets WHERE token = ?', [token], async (err, results) => {
    if (err) {
      console.error('Error finding reset token:', err);
      return res.status(500).json({ error: 'Server error' });
    }
    if (results.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired token' });
    }
    const reset = results[0];
    if (new Date(reset.expires_at) < new Date()) {
      return res.status(400).json({ error: 'Token has expired' });
    }
    // Update user password
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query('UPDATE users SET password = ? WHERE id = ?', [hashedPassword, reset.user_id], (err2) => {
      if (err2) {
        console.error('Error updating password:', err2);
        return res.status(500).json({ error: 'Server error' });
      }
      // Delete the reset token
      db.query('DELETE FROM password_resets WHERE id = ?', [reset.id], (err3) => {
        if (err3) {
          console.error('Error deleting reset token:', err3);
        }
        res.json({ message: 'Password has been reset successfully.' });
      });
    });
  });
});

// Health check endpoint for Railway
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date(),
    environment: process.env.NODE_ENV || 'development'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
}); 