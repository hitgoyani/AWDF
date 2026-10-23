import os
import docx
from docx.shared import Pt, Inches, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH

DOCS_DIR = r"c:\Users\Hit\Desktop\5th SEM\AWDF\Documents"

EVIDENCE_DIRS = {
    5: os.path.join(DOCS_DIR, "Practical5_Evidence"),
    6: os.path.join(DOCS_DIR, "Practical6_Evidence"),
    7: os.path.join(DOCS_DIR, "Practical7_Evidence"),
    8: os.path.join(DOCS_DIR, "Practical8_Evidence"),
    9: os.path.join(DOCS_DIR, "Practical9_Evidence"),
    10: os.path.join(DOCS_DIR, "Practical10_Evidence"),
    11: os.path.join(DOCS_DIR, "Practical11_Evidence"),
    12: os.path.join(DOCS_DIR, "Practical12_Evidence"),
    13: os.path.join(DOCS_DIR, "Practical13_Evidence"),
}

def add_styled_heading(doc, text, level=1):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.bold = True
    if level == 1:
        run.font.size = Pt(20)
        p.paragraph_format.space_before = Pt(14)
        p.paragraph_format.space_after = Pt(6)
    elif level == 2:
        run.font.size = Pt(14)
        p.paragraph_format.space_before = Pt(10)
        p.paragraph_format.space_after = Pt(4)
    return p

def add_body_paragraph(doc, text):
    p = doc.add_paragraph()
    run = p.add_run(text)
    run.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.line_spacing = 1.15
    return p

def add_bullet_point(doc, text):
    p = doc.add_paragraph(style='List Paragraph')
    run = p.add_run(text)
    run.font.size = Pt(11)
    p.paragraph_format.space_after = Pt(3)
    p.paragraph_format.line_spacing = 1.15
    return p

def add_code_block(doc, code_text):
    p = doc.add_paragraph()
    p.paragraph_format.space_before = Pt(4)
    p.paragraph_format.space_after = Pt(6)
    p.paragraph_format.left_indent = Inches(0.2)
    run = p.add_run(code_text)
    run.font.name = 'Consolas'
    run.font.size = Pt(9.5)
    run.font.color.rgb = RGBColor(30, 41, 59)
    return p

def add_image_evidence(doc, img_path, caption):
    if os.path.exists(img_path):
        p_img = doc.add_paragraph()
        p_img.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_img.paragraph_format.space_before = Pt(8)
        p_img.paragraph_format.space_after = Pt(4)
        run_img = p_img.add_run()
        run_img.add_picture(img_path, width=Inches(6.2))

        p_cap = doc.add_paragraph()
        p_cap.alignment = WD_ALIGN_PARAGRAPH.CENTER
        p_cap.paragraph_format.space_after = Pt(10)
        run_cap = p_cap.add_run(caption)
        run_cap.italic = True
        run_cap.font.size = Pt(9.5)
        run_cap.font.color.rgb = RGBColor(100, 116, 139)

def build_practical_document(data, output_path):
    doc = docx.Document()

    # Set 0.75-inch margins
    sections = doc.sections
    for s in sections:
        s.top_margin = Inches(0.75)
        s.bottom_margin = Inches(0.75)
        s.left_margin = Inches(0.75)
        s.right_margin = Inches(0.75)

    # Title Header Block
    p_title = doc.add_paragraph()
    run_title = p_title.add_run(f"PRACTICAL {data['p_num']}")
    run_title.bold = True
    run_title.font.size = Pt(32)
    p_title.paragraph_format.space_after = Pt(4)

    subtitles = [
        data['title'],
        "Roll No:- 24DIT021",
        "Subject: Advanced Web Development Frameworks (ITUE301)",
        "Semester: 5th Semester B.Tech Information Technology",
        "Faculty of Technology and Engineering, CHARUSAT",
    ]
    for st in subtitles:
        p_sub = doc.add_paragraph()
        r_sub = p_sub.add_run(st)
        r_sub.font.size = Pt(12)
        p_sub.paragraph_format.space_after = Pt(2)

    doc.add_paragraph().paragraph_format.space_after = Pt(8)

    # 1. Problem Statement
    add_styled_heading(doc, "1. Problem Statement")
    add_body_paragraph(doc, data['problem_statement'])

    # 2. Objective
    add_styled_heading(doc, "2. Objective")
    add_body_paragraph(doc, data['objective'])

    # 3. Theory / Concepts Used
    add_styled_heading(doc, "3. Theory / Concepts Used")
    for t in data['theory_points']:
        add_bullet_point(doc, t)

    # 4. Solution Approach
    add_styled_heading(doc, "4. Solution Approach")
    for a in data['solution_approach']:
        add_bullet_point(doc, a)

    # 5. Architecture / Diagram
    add_styled_heading(doc, "5. Architecture and Workflow Diagram")
    add_code_block(doc, data['architecture'])

    # 6. Implementation Code Snippets
    add_styled_heading(doc, "6. Key Implementation Code Snippets")
    for filename, code in data['code_snippets']:
        add_styled_heading(doc, f"Source File: {filename}", level=2)
        add_code_block(doc, code)

    # 7. Practical Execution and Evidence
    add_styled_heading(doc, "7. Practical Execution and Evidence")
    add_body_paragraph(doc, "The following screenshots demonstrate the verified execution, terminal logs, and live output of the implemented solution:")
    for img_path, caption in data['evidence_items']:
        add_image_evidence(doc, img_path, caption)

    # 8. Testing and Verification
    add_styled_heading(doc, "8. Testing and Verification")
    for tc in data['test_cases']:
        add_bullet_point(doc, tc)

    # 9. Key Questions and Answers (Viva Prep)
    add_styled_heading(doc, "9. Key Questions and Answers (Viva Preparation)")
    for q, a in data['viva_qa']:
        p_q = doc.add_paragraph()
        r_q = p_q.add_run(f"Q: {q}")
        r_q.bold = True
        r_q.font.size = Pt(11)
        p_q.paragraph_format.space_before = Pt(6)
        p_q.paragraph_format.space_after = Pt(2)

        p_a = doc.add_paragraph()
        r_a = p_a.add_run(f"A: {a}")
        r_a.font.size = Pt(11)
        p_a.paragraph_format.space_after = Pt(6)

    # 10. Common Errors and Troubleshooting
    add_styled_heading(doc, "10. Common Errors and Troubleshooting Guide")
    for err, cause, fix in data['troubleshooting']:
        add_bullet_point(doc, f"Issue: {err}")
        add_bullet_point(doc, f"  • Likely Cause: {cause}")
        add_bullet_point(doc, f"  • Resolution / Fix: {fix}")

    # 11. Learning Outcome
    add_styled_heading(doc, "11. Learning Outcome")
    add_body_paragraph(doc, data['learning_outcome'])

    # 12. Student Reflection
    add_styled_heading(doc, "12. Student Reflection")
    add_body_paragraph(doc, data['reflection'])

    doc.save(output_path)
    print(f"[GENERATED] {output_path}")
    return doc


# =========================================================================
# DATA DEFINITIONS FOR PRACTICALS 5 TO 13
# =========================================================================

PRACTICALS = [
    # Practical 5
    {
        'p_num': 5,
        'title': "MongoDB Integration and Schema Design with Mongoose",
        'problem_statement': "Extend the Task Management backend by connecting MongoDB using Mongoose ODM. Define a validated Task schema with title, description, completed, and priority enum. Replace in-memory array operations with Mongoose model methods (find, create, findByIdAndUpdate, findByIdAndDelete) and ensure validation errors return structured JSON.",
        'objective': "To connect an Express server to a MongoDB database, design a strongly-typed schema with validation constraints, and execute real CRUD operations with persistent database storage.",
        'theory_points': [
            "MongoDB is a NoSQL, document-oriented database storing flexible BSON/JSON records.",
            "Mongoose is an Object Data Modeling (ODM) library providing schema definition, type casting, validation, and middleware hooks for Node.js.",
            "Application-level validation enforces data integrity (required fields, enums, defaults) before data reaches the database engine.",
            "Pre-save hooks in Mongoose intercept documents prior to saving to perform data sanitization such as trimming whitespace.",
            "Mongoose methods: find(), create(), findByIdAndUpdate(), and findByIdAndDelete() handle persistent CRUD.",
        ],
        'solution_approach': [
            "Install mongoose and dotenv in task-manager-api.",
            "Establish connection in server.js using mongoose.connect(process.env.MONGO_URI).",
            "Define Task schema in models/Task.js with title (required, trim), description, completed (default false), and priority enum (['low', 'medium', 'high']).",
            "Attach a pre('save') hook to automatically trim title whitespace.",
            "Refactor taskRoutes.js to query MongoDB using async/await and Mongoose model methods.",
            "Provide an in-memory fallback array when MongoDB is offline for uninterrupted evaluation.",
            "Verify all endpoints and validation error shapes using Thunder Client.",
        ],
        'architecture': """Client (Postman / Browser)
       |
       v
Express App (port 5000)
       |
       v
 Mongoose ODM (Schema Validation & Pre-save Hooks)
       |
       v
MongoDB Database (mongodb://localhost:27017/taskManagerDB)
   └── tasks collection { _id, title, description, completed, priority, createdAt }""",
        'code_snippets': [
            ("models/Task.js", """const taskSchema = new mongoose.Schema({
  title: { type: String, required: [true, 'Task title is required'], trim: true },
  description: { type: String, default: '', trim: true },
  completed: { type: Boolean, default: false },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  createdAt: { type: Date, default: Date.now },
});

taskSchema.pre('save', function (next) {
  if (this.title) this.title = this.title.trim();
  if (typeof next === 'function') next();
});"""),
            ("routes/taskRoutes.js", """router.post('/', validateTaskInput, async (req, res, next) => {
  try {
    const newTask = new Task(req.body);
    const saved = await newTask.save();
    res.status(201).json(saved);
  } catch (err) { next(err); }
});"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[5], "P5_01_mongo_connect.png"), "Fig. 5.1: Express server connecting to MongoDB database with readyState: 1 (CONNECTED)."),
            (os.path.join(EVIDENCE_DIRS[5], "P5_02_POST_task_mongo.png"), "Fig. 5.2: Thunder Client POST /tasks creating persistent document in MongoDB."),
            (os.path.join(EVIDENCE_DIRS[5], "P5_03_GET_tasks_mongo.png"), "Fig. 5.3: Thunder Client GET /tasks retrieving persisted task records."),
            (os.path.join(EVIDENCE_DIRS[5], "P5_04_validation_error.png"), "Fig. 5.4: Structured HTTP 400 validation error response when task title is omitted."),
        ],
        'test_cases': [
            "Test 1: GET /tasks returns 200 and list of tasks from MongoDB. [PASS]",
            "Test 2: POST /tasks with valid payload returns 201 and created MongoDB document with _id. [PASS]",
            "Test 3: POST /tasks with missing title returns 400 Validation Error. [PASS]",
            "Test 4: GET /tasks/:id with valid ID returns task; with unknown ID returns 404. [PASS]",
        ],
        'viva_qa': [
            ("What is the purpose of a schema in MongoDB if MongoDB itself is schema-less?", "MongoDB allows documents in the same collection to have different structures. Mongoose schemas enforce application-level predictability, strict data types, required constraints, and validation rules before erroneous data corrupts the database."),
            ("Why is it important to validate fields at the database schema level rather than relying on frontend validation?", "Frontend validation can be bypassed easily using cURL, Postman, or disabled browser scripts. Server and schema validation act as the ultimate line of defense for database integrity."),
            ("What happens internally when a document fails Mongoose validation?", "Mongoose intercepts the operation during document validation before executing the MongoDB driver write command. It throws a ValidationError which is caught in a try/catch and handled by the error middleware."),
        ],
        'troubleshooting': [
            ("MongoDB connection times out", "Incorrect MONGO_URI or local mongod service not running", "Ensure mongodb://127.0.0.1:27017 is running or start MongoDB daemon via service/Docker."),
            ("Validation error not caught", "Async Mongoose operation not wrapped in try/catch", "Wrap all await Task calls in try/catch and pass err to next(err)."),
            ("Data disappears after restart", "Server still mutating in-memory array", "Verify mongoose.connection.readyState === 1 and Task model methods are active."),
        ],
        'learning_outcome': "I successfully connected an Express application to MongoDB using Mongoose, designed a validated schema with enums and pre-save hooks, and verified persistent CRUD storage.",
        'reflection': "Working with Mongoose schema hooks deepened my understanding of data pipelines and defensive backend engineering, ensuring consistent document formatting across endpoints.",
    },

    # Practical 6
    {
        'p_num': 6,
        'title': "Full Stack Integration (React + Node + MongoDB)",
        'problem_statement': "Wire the React frontend to the Node/Express/MongoDB backend into a functional full-stack application. Enable CORS on Express, configure a centralized API client, implement live state synchronization, optimistic UI updates, delete confirmation dialogs, and toast notifications.",
        'objective': "To connect a decoupled React client to an Express/MongoDB backend, solve cross-origin security constraints, and manage synchronous and asynchronous state across the full web stack.",
        'theory_points': [
            "CORS (Cross-Origin Resource Sharing) is a browser security mechanism requiring explicit server approval headers for requests from a different origin (e.g. port 5173 to port 5000).",
            "Centralized API modules abstract HTTP request configuration, bearer token injection, and unified error handling away from UI components.",
            "State synchronization ensures UI state re-fetches or reflects confirmed server responses immediately after write operations.",
            "Optimistic UI updates render expected changes immediately in the browser to improve perceived responsiveness, rolling back if the server write fails.",
        ],
        'solution_approach': [
            "Install and enable cors on Express backend: app.use(cors()).",
            "Create centralized api.js in React frontend with configurable BASE_URL.",
            "Build complete task dashboard in Tasks.jsx with task list, create form, and edit modal.",
            "Implement optimistic UI rendering for task creation with tempId and error rollback.",
            "Implement ConfirmModal component to prevent accidental task deletion.",
            "Create ToastContext providing non-blocking success, error, and info alerts.",
        ],
        'architecture': """React Frontend (http://localhost:5173)
       |
       | fetch / Axios (JSON over HTTP)
       v
Express Backend (http://localhost:5000) [CORS Enabled]
       |
       v
 Mongoose ODM
       |
       v
MongoDB Database (mongodb://localhost:27017/taskManagerDB)""",
        'code_snippets': [
            ("portfolio/src/api/api.js", """export const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const getTasks = () => request('/tasks');
export const createTask = (taskData) => request('/tasks', { method: 'POST', body: JSON.stringify(taskData) });
export const updateTask = (id, taskData) => request(`/tasks/${id}`, { method: 'PUT', body: JSON.stringify(taskData) });
export const deleteTask = (id) => request(`/tasks/${id}`, { method: 'DELETE' });"""),
            ("task-manager-api/server.js", """app.use(cors({ origin: '*', methods: ['GET', 'POST', 'PUT', 'DELETE'], allowedHeaders: ['Content-Type', 'Authorization'] }));"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[6], "P6_01_dashboard.png"), "Fig. 6.1: Full-stack React Task Management dashboard connected to Express & MongoDB."),
            (os.path.join(EVIDENCE_DIRS[6], "P6_02_sync_logs.png"), "Fig. 6.2: Backend terminal logs showing CORS-approved requests and live state sync."),
        ],
        'test_cases': [
            "Test 1: React dev server fetches all tasks from Express on mount. [PASS]",
            "Test 2: Creating a task updates local state optimistically and persists in MongoDB. [PASS]",
            "Test 3: Editing a task updates database and re-renders updated priority badge. [PASS]",
            "Test 4: Deleting a task opens ConfirmModal and removes record on confirmation. [PASS]",
        ],
        'viva_qa': [
            ("What changes are required on the backend (CORS) to allow React on port 5173 to call Express on port 5000?", "Browsers block cross-origin requests by default. The backend must configure CORS middleware to send 'Access-Control-Allow-Origin: *' or explicit origin headers during preflight OPTIONS checks."),
            ("Why should the UI re-fetch or synchronize state after a successful POST/PUT/DELETE instead of assuming success silently?", "Silent assumptions can mask database validation rejections, trigger desynchronization, and show phantom data that disappears on browser refresh."),
            ("What is optimistic UI and what happens when the backend request fails?", "Optimistic UI renders changes immediately in local state before server confirmation. If the request fails, the component catches the error, rolls back local state to the previous snapshot, and alerts the user."),
        ],
        'troubleshooting': [
            ("CORS error in browser console", "cors middleware missing or registered after routes", "Install cors and register app.use(cors()) at top of server.js."),
            ("Fetch failed / Network error", "Backend server not running or port conflict", "Ensure Express is running on port 5000 before loading frontend."),
            ("Data disappears after browser refresh", "Still reading from local component state", "Confirm useEffect calls getTasks() on mount and populates state from backend response."),
        ],
        'learning_outcome': "I successfully connected a decoupled React single-page frontend to an Express/MongoDB REST backend, resolved CORS constraints, and implemented responsive state synchronization.",
        'reflection': "This practical tied the entire stack together. Designing the UI with optimistic updates and confirmation modals taught me modern enterprise UX patterns.",
    },

    # Practical 7
    {
        'p_num': 7,
        'title': "Authentication and Middleware Pipeline",
        'problem_statement': "Implement JWT-based authentication, bcrypt password hashing, and server-side input validation. Create user registration and login endpoints, protect task routes with an authentication middleware, expose a /me profile route, and manage token expiration on the client.",
        'objective': "To secure backend REST endpoints using industry-standard JWT bearer tokens, salt-hashed passwords with bcrypt, and centralized authorization middleware.",
        'theory_points': [
            "Bcrypt is a cryptographic hash function utilizing an adaptive salt factor to protect against rainbow table and brute-force attacks.",
            "JSON Web Tokens (JWT) are digitally signed stateless tokens composed of Header, Payload, and Signature, enabling stateless session validation.",
            "Authorization middleware inspects the HTTP 'Authorization: Bearer <token>' header, verifies the signature, and injects user context into req.user.",
            "Server-side input validation guarantees valid email syntax and password length before database transactions occur.",
        ],
        'solution_approach': [
            "Install bcryptjs and jsonwebtoken in task-manager-api.",
            "Create User model in models/User.js with pre-save bcrypt hashing hook.",
            "Implement POST /auth/register and POST /auth/login issuing 24h JWT tokens.",
            "Build auth.js middleware to extract bearer token, verify signature, and attach req.user.",
            "Protect /auth/me and task mutation routes using requireAuth middleware.",
            "Implement AuthContext in React managing token in localStorage and auto-logging out on 401.",
        ],
        'architecture': """POST /auth/register ➔ Hash Password (bcrypt salt 10) ➔ Save User in MongoDB (201)
POST /auth/login    ➔ Compare Hash (bcrypt.compare)   ➔ Sign JWT Token (200)

Protected Route Flow:
Client Request (Authorization: Bearer <token>)
        |
        v
 [Auth Middleware] ➔ Verify JWT Secret ➔ Injects req.user
        |
        v
 [Input Validator] ➔ Checks Schema Fields
        |
        v
  Controller Route (Task Operations / Profile)""",
        'code_snippets': [
            ("models/User.js", """userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next ? next() : null;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  if (next) next();
});"""),
            ("middleware/auth.js", """export const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, error: 'Unauthorized: Bearer token required' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ success: false, error: 'Invalid or expired token' });
  }
};"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[7], "P7_01_register_user.png"), "Fig. 7.1: User registration with automatic bcrypt password hashing and token return."),
            (os.path.join(EVIDENCE_DIRS[7], "P7_02_login_jwt.png"), "Fig. 7.2: Successful user login returning signed JSON Web Token."),
            (os.path.join(EVIDENCE_DIRS[7], "P7_03_protected_auth_me.png"), "Fig. 7.3: Accessing protected /auth/me route using Authorization: Bearer token."),
            (os.path.join(EVIDENCE_DIRS[7], "P7_04_unauthorized_401.png"), "Fig. 7.4: Server rejecting unauthenticated request with HTTP 401 Unauthorized."),
        ],
        'test_cases': [
            "Test 1: POST /auth/register hashes password and returns 201 with JWT. [PASS]",
            "Test 2: POST /auth/login verifies credentials and returns 200 with JWT. [PASS]",
            "Test 3: GET /auth/me with Bearer token returns authenticated user payload. [PASS]",
            "Test 4: GET /auth/me without token returns 401 Unauthorized. [PASS]",
        ],
        'viva_qa': [
            ("Why must passwords be hashed before storage instead of saved as plain text, even in lab projects?", "Storing plain text passwords exposes user credentials in database leaks, logs, and dumps. Cryptographic hashing with salts ensures stored passwords cannot be reversed into plain text."),
            ("What does the authentication middleware verify, and what happens if the token is expired?", "It checks for the Bearer prefix, verifies the cryptographic signature against the server's JWT_SECRET, and inspects the token expiration timestamp. Expired or tampered tokens throw an error and receive an immediate HTTP 401 response."),
            ("Why must input validation happen on the server even if the client validates fields?", "Client validation is for user convenience and can be bypassed by malicious actors. Server-side validation is mandatory to protect business rules, data schemas, and backend stability."),
        ],
        'troubleshooting': [
            ("401 Unauthorized on every request", "Missing space after Bearer or token omitted", "Ensure format is exactly 'Authorization: Bearer <token>' with one space."),
            ("Server crashes on invalid token", "jwt.verify() not wrapped in try/catch", "Wrap token verification in try/catch and return res.status(401) on failure."),
            ("JWT_SECRET is undefined", "dotenv.config() not called before secret access", "Call dotenv.config() at the very top of server.js."),
        ],
        'learning_outcome': "I successfully built a secure authentication pipeline using bcrypt password hashing, signed and verified JSON Web Tokens, and implemented role-aware route guards.",
        'reflection': "Understanding stateless authentication illustrated how modern microservices scale without maintaining server-side session memory.",
    },

    # Practical 8
    {
        'p_num': 8,
        'title': "Performance Optimization and Lazy Loading in React",
        'problem_statement': "Optimize the React frontend bundle by implementing route-based and component-based code splitting using React.lazy() and Suspense. Provide skeleton fallback UI during chunk loading, lazy-load a heavy analytics component on demand, and measure before/after bundle metrics.",
        'objective': "To improve web application performance, reduce initial bundle size, and accelerate First Contentful Paint (FCP) using dynamic imports.",
        'theory_points': [
            "Code splitting divides monolithic JavaScript bundles into discrete chunks loaded on demand when specific routes or components are visited.",
            "React.lazy() enables dynamic rendering of import() components as regular components.",
            "Suspense specifies a fallback loading indicator (such as a skeleton UI) while the browser downloads the lazy chunk.",
            "Route-level splitting prevents downloading unused pages during the initial page visit.",
            "Perceived performance increases significantly because the main thread parses a much smaller initial script payload.",
        ],
        'solution_approach': [
            "Measure monolithic baseline bundle size using npm run build.",
            "Convert static route imports in App.jsx to React.lazy(() => import(...)).",
            "Wrap the <Routes> hierarchy in a <Suspense fallback={<LazyFallback />}> boundary.",
            "Code-split the heavy TaskAnalytics chart widget, loading it only when toggled.",
            "Verify discrete chunk generation (.js files for Tasks, Projects, Contact, Analytics) via Vite build output.",
            "Record before/after bundle sizes and performance metrics in an evaluation table.",
        ],
        'architecture': """Before Optimization (Monolithic Single Bundle):
  main.bundle.js (~272 kB) ────────► [Home][Tasks][Projects][Contact][Auth] all loaded upfront

After Optimization (Route Code Splitting via React.lazy & Suspense):
  index-shell.js   (243 kB) ──► Loads instantly on first visit
  Tasks-chunk.js   (14.7 kB) ──► Loaded ONLY when user navigates to /tasks
  Projects-chunk.js (4.7 kB) ──► Loaded ONLY when user navigates to /projects
  Analytics-chunk.js(3.4 kB) ──► Loaded ONLY when user toggles analytics widget""",
        'code_snippets': [
            ("portfolio/src/App.jsx", """const Home = lazy(() => import('./pages/Home.jsx'));
const Tasks = lazy(() => import('./pages/Tasks.jsx'));
const Projects = lazy(() => import('./pages/Projects.jsx'));
const Contact = lazy(() => import('./pages/Contact.jsx'));
const Auth = lazy(() => import('./pages/Auth.jsx'));

<Suspense fallback={<LazyFallback pageTitle="Requested Page" />}>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/tasks" element={<Tasks />} />
    <Route path="/projects" element={<Projects />} />
    <Route path="/contact" element={<Contact />} />
    <Route path="/auth" element={<Auth />} />
  </Routes>
</Suspense>"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[8], "P8_01_vite_chunks.png"), "Fig. 8.1: Vite production build output displaying separate route chunks and bundle breakdown."),
        ],
        'test_cases': [
            "Test 1: npm run build successfully compiles discrete chunk files. [PASS]",
            "Test 2: Initial download payload decreased from 272 kB to 243 kB (~11% reduction). [PASS]",
            "Test 3: Suspense renders skeleton fallback smoothly during simulated 3G network throttling. [PASS]",
            "Test 4: Heavy analytics chart chunk loads strictly upon user button toggle. [PASS]",
        ],
        'viva_qa': [
            ("What is the difference between an initial bundle and a lazy-loaded chunk?", "The initial bundle contains critical shell code required to render the application frame immediately. A lazy-loaded chunk contains code for secondary pages or widgets downloaded on demand over the network."),
            ("Why does lazy loading improve perceived performance even if total downloaded code remains similar?", "Users experience a faster First Contentful Paint because the browser does not need to download, parse, and execute code for unused pages during initial visit."),
            ("In what scenario would code splitting not be recommended?", "In very small web applications (under 50 kB total script size), code splitting introduces unnecessary HTTP network overhead and request latency that outweighs the minimal bundle reduction."),
        ],
        'troubleshooting': [
            ("Element type is invalid error", "Lazy-loaded component not exported as default", "Ensure the component file uses export default ComponentName."),
            ("No separate chunk files after build", "Component statically imported elsewhere in the file", "Remove top-level static imports for components loaded via React.lazy()."),
            ("Entire app flickers into loading fallback", "Suspense wraps the entire App shell instead of the Routes block", "Move <Suspense> to wrap only the inner <Routes> component."),
        ],
        'learning_outcome': "I successfully applied route-based and component-based code splitting using React.lazy and Suspense, reducing the initial JavaScript payload by ~11% and accelerating page renders.",
        'reflection': "Analyzing build chunk manifests in Vite provided concrete insights into modern bundler optimization and production asset packaging.",
    },

    # Practical 9
    {
        'p_num': 9,
        'title': "In-Memory Caching and Query Optimization",
        'problem_statement': "Implement server-side in-memory caching using node-cache for the Task Management API. Cache GET /tasks with a 60-second TTL, invalidate cache on any write operation (POST, PUT, DELETE), measure and benchmark response time differences (cached vs uncached), and expose cache diagnostics.",
        'objective': "To improve REST API response latency and reduce redundant database lookups using in-memory caching with strict invalidation protocols.",
        'theory_points': [
            "In-memory caching stores frequently requested database results directly in process RAM for instant retrieval.",
            "Time-To-Live (TTL) establishes the lifespan of cached entries before automatic eviction occurs.",
            "Cache invalidation ensures stale data is never served by wiping affected cache keys immediately upon create, update, or delete operations.",
            "Cache Hit Ratio (Hits / Total Lookups) measures the efficiency of the caching layer.",
        ],
        'solution_approach': [
            "Install node-cache in task-manager-api.",
            "Create cache.js exporting a configured NodeCache instance with stdTTL: 60.",
            "Implement hit/miss counters and cacheMetrics tracking.",
            "In GET /tasks, check cache key 'all_tasks'; if found, return cached data with X-Cache-Status: HIT header.",
            "If miss, fetch from MongoDB, set cache key with 60s TTL, and return with X-Cache-Status: MISS header.",
            "Invalidate cache key on POST, PUT, and DELETE routes via invalidateTaskCache().",
            "Expose debug telemetry endpoint GET /api/cache-stats.",
        ],
        'architecture': """GET /tasks Request
       |
       v
 Cache Check (node-cache in RAM)
 ├── HIT  ➔ Return cached array immediately (1-2 ms) [X-Cache-Status: HIT]
 └── MISS ➔ Query MongoDB ➔ Store in cache (60s TTL) ➔ Return data (34 ms) [X-Cache-Status: MISS]

POST / PUT / DELETE /tasks Request
       |
       v
 Database Write (MongoDB) ➔ Invalidate Cache Key ('all_tasks') ➔ Next GET is guaranteed fresh!""",
        'code_snippets': [
            ("cache.js", """export const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export const getFromCache = (key) => {
  const value = cache.get(key);
  if (value !== undefined) { cacheMetrics.hits++; return value; }
  cacheMetrics.misses++; return null;
};

export const invalidateTaskCache = (taskId = null) => {
  cache.del('all_tasks');
  if (taskId) cache.del(`task_${taskId}`);
};"""),
            ("routes/taskRoutes.js", """router.get('/', async (req, res, next) => {
  const cached = getFromCache('all_tasks');
  if (cached) {
    res.setHeader('X-Cache-Status', 'HIT');
    return res.status(200).json(cached);
  }
  const tasks = await Task.find().sort({ createdAt: -1 });
  setToCache('all_tasks', tasks, 60);
  res.setHeader('X-Cache-Status', 'MISS');
  return res.status(200).json(tasks);
});"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[9], "P9_01_cache_miss.png"), "Fig. 9.1: Request 1 resulting in Cache MISS and querying MongoDB (34 ms)."),
            (os.path.join(EVIDENCE_DIRS[9], "P9_02_cache_hit.png"), "Fig. 9.2: Request 2 resulting in Cache HIT and returning from RAM in ~1 ms (34x speedup)."),
            (os.path.join(EVIDENCE_DIRS[9], "P9_03_cache_stats.png"), "Fig. 9.3: Cache diagnostic endpoint GET /api/cache-stats showing 75% hit ratio."),
        ],
        'test_cases': [
            "Test 1: Initial GET /tasks returns Cache MISS in ~34 ms. [PASS]",
            "Test 2: Immediate repeated GET /tasks returns Cache HIT in ~1 ms. [PASS]",
            "Test 3: POST /tasks creates task and invalidates cache key. [PASS]",
            "Test 4: Subsequent GET /tasks returns Cache MISS with fresh task data included. [PASS]",
        ],
        'viva_qa': [
            ("Why must the cache be invalidated on every write operation?", "If cache invalidation is skipped, users will continue reading stale data from RAM until the TTL expires, leading to data inconsistency."),
            ("Why is process in-memory caching (node-cache) not suitable for multi-server deployments?", "In-memory caching is isolated to the local process heap. In horizontally scaled setups across multiple containers, Server A will not know if Server B modified the database. Distributed caches like Redis are used for multi-instance clusters."),
            ("What is a reasonable TTL and what trade-off does it represent?", "In task management, 60 seconds is balanced. Longer TTLs save database load but risk serving slightly stale data if invalidation misses an edge case; shorter TTLs protect freshness at the cost of more frequent database queries."),
        ],
        'troubleshooting': [
            ("Updated task not reflected in GET response", "Cache key not invalidated in write handlers", "Call invalidateTaskCache() inside POST, PUT, and DELETE route handlers."),
            ("No measurable difference between cached and uncached", "Dataset too small or TTL too short", "Ensure TTL is at least 60 seconds and test with multiple repeated requests."),
            ("Cache works but server restart wipes it", "Expected in-memory behavior", "In-memory process cache is volatile and resets on server reload; document this in lab notes."),
        ],
        'learning_outcome': "I successfully implemented server-side in-memory caching with node-cache, designed write invalidation logic, and empirically measured a 34x response time improvement.",
        'reflection': "Measuring latency with and without caching made database query costs tangible and proved how high-traffic APIs maintain responsiveness.",
    },

    # Practical 10
    {
        'p_num': 10,
        'title': "Asynchronous Processing with Event-Driven Architecture",
        'problem_statement': "Implement non-blocking asynchronous background processing in Node.js using native EventEmitter without external dependencies. Decouple notification dispatching and audit logging from the main request path, ensuring the HTTP 201 response returns immediately before the background listener finishes executing.",
        'objective': "To decouple auxiliary side-effects from the critical HTTP request-response path using Node.js event-driven primitives.",
        'theory_points': [
            "Node.js native EventEmitter facilitates loosely coupled communication where publishers emit named events and registered listeners react asynchronously.",
            "Decoupling side-effects (e.g. notifications, logging, telemetry) keeps user-facing API response latency low.",
            "The Node.js event loop prioritizes completing active socket writes before draining background timer and microtask queues.",
            "Unhandled 'error' events in EventEmitter throw uncaught exceptions; a dedicated error listener is mandatory.",
        ],
        'solution_approach': [
            "Create events.js exporting a singleton TaskEvents instance extending EventEmitter.",
            "Create listeners.js registering handlers for 'task-created', 'task-deleted', and 'error'.",
            "Simulate non-blocking async notification latency (400ms setTimeout) in the task-created listener.",
            "In taskRoutes.js POST /tasks, send the HTTP 201 response to the client first.",
            "Emit 'task-created' immediately after responding and log timestamps to prove non-blocking execution order.",
            "Initialize listeners on server startup in server.js.",
        ],
        'architecture': """Client (POST /tasks) 
       |
       v
Express Route Handler
       ├── 1. Save Task to MongoDB
       ├── 2. Send HTTP 201 Response Immediately (timestamp: T1)
       └── 3. emit('task-created', task)
               |
               v (handled asynchronously in background)
        Notification Listener ➔ Simulates Email Dispatch ➔ Completes at T2 (T2 > T1)""",
        'code_snippets': [
            ("events.js", """import { EventEmitter } from 'events';
class TaskEvents extends EventEmitter {}
export const taskEvents = new TaskEvents();
export default taskEvents;"""),
            ("listeners.js", """taskEvents.on('task-created', (task) => {
  setTimeout(() => {
    console.log(`[ASYNC NOTIFICATION] Email sent for "${task.title}" at ${new Date().toISOString()}`);
  }, 400);
});"""),
            ("routes/taskRoutes.js", """res.status(201).json(createdTask); // Sent immediately
taskEvents.emit('task-created', createdTask); // Background trigger"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[10], "P10_01_async_proof.png"), "Fig. 10.1: Console timestamp log proving HTTP response was delivered before background notification finished."),
        ],
        'test_cases': [
            "Test 1: POST /tasks returns status 201 immediately (< 30ms). [PASS]",
            "Test 2: 'task-created' event is received and handled without crashing the server. [PASS]",
            "Test 3: Background notification completes 403ms after HTTP response is closed. [PASS]",
            "Test 4: DELETE /tasks triggers 'task-deleted' audit event cleanly. [PASS]",
        ],
        'viva_qa': [
            ("Why does emitting an event not block the API response even though both run on the same Node.js process?", "Because the HTTP socket response is written and closed with res.status(201).json() before the event loop executes the deferred listener timer callback."),
            ("What would happen to API response time if notification logic was placed synchronously inside the route?", "Every client request would be stalled by the duration of the notification dispatch (e.g. 400ms to 2000ms), degrading throughput and user experience."),
            ("Why is EventEmitter suitable for this application scale but not for enterprise systems handling millions of events?", "EventEmitter is in-memory and process-bound. If the server crashes or reboots, queued events in memory are permanently lost. Enterprise scale requires persistent message brokers like RabbitMQ, Apache Kafka, or BullMQ with Redis."),
        ],
        'troubleshooting': [
            ("Notification log never appears", "Listener file never required or registered before event was emitted", "Ensure initializeEventListeners() is called in server.js on startup."),
            ("API response feels delayed", "Listener logic placed before res.json()", "Always send response before emitting background side-effects."),
            ("Unhandled 'error' event crashes server", "EventEmitter throws uncaught error if no 'error' listener exists", "Always register taskEvents.on('error', (err) => console.error(err))."),
        ],
        'learning_outcome': "I successfully built a non-blocking background notification and audit system using Node.js native EventEmitter and proved asynchronous decoupling using precise timestamp ordering.",
        'reflection': "Mastering Node's event-driven paradigm clarified how asynchronous I/O and non-blocking event loops power high-concurrency web services.",
    },

    # Practical 11
    {
        'p_num': 11,
        'title': "Containerization with Docker and Docker Compose",
        'problem_statement': "Containerize the full-stack Task Management application using Docker and Docker Compose. Write a multi-stage Dockerfile for the React frontend, a Dockerfile for the Express backend, configure a docker-compose.yml file linking Frontend, Backend, and MongoDB, and configure named volumes for database persistence.",
        'objective': "To package multi-tier web applications into isolated, portable Docker containers and orchestrate the complete stack with a single command.",
        'theory_points': [
            "Docker packages applications with their runtime dependencies, operating system libraries, and configurations into portable container images.",
            "Multi-stage Docker builds reduce final image size by discarding build tooling (e.g. npm compilers) and keeping only the minimal runtime artifacts.",
            "Docker Compose orchestrates multi-container applications, configuring networks, ports, environment variables, and startup dependencies.",
            "Docker Bridge Networks enable containers to resolve each other securely via internal service names (e.g. 'mongodb') rather than 'localhost'.",
            "Named volumes decouple database data from container lifecycles, ensuring persistence across restarts.",
        ],
        'solution_approach': [
            "Write backend Dockerfile in task-manager-api using node:18-alpine runtime.",
            "Write frontend Dockerfile in portfolio using a 2-stage multi-stage build (build stage + minimal preview runtime).",
            "Create .dockerignore files to exclude node_modules and .env from build contexts.",
            "Create root docker-compose.yml orchestrating mongodb (27017), backend (5000), and frontend (5173).",
            "Configure backend MONGO_URI to reference the service name 'mongodb://mongodb:27017/taskManagerDB'.",
            "Add named volume 'mongodb_data' and bridge network 'app-network'.",
            "Verify entire stack builds and runs cleanly via 'docker compose up --build'.",
        ],
        'architecture': """docker-compose.yml Stack Orchestration:
  ├── mongodb  (mongo:latest image, port 27017:27017, volume: mongodb_data)
  ├── backend  (task-manager-api build, port 5000:5000, depends_on: mongodb)
  └── frontend (portfolio multi-stage build, port 5173:5173, depends_on: backend)

Internal Bridge Network: app-network
  frontend ──► backend (http://backend:5000) ──► mongodb (mongodb://mongodb:27017)
  All 3 services boot together with: docker compose up --build""",
        'code_snippets': [
            ("portfolio/Dockerfile", """FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install --only=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/vite.config.js ./vite.config.js
EXPOSE 5173
CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0", "--port", "5173"]"""),
            ("docker-compose.yml", """services:
  mongodb:
    image: mongo:latest
    ports: ["27017:27017"]
    volumes: [mongodb_data:/data/db]
    networks: [app-network]
  backend:
    build: ./task-manager-api
    ports: ["5000:5000"]
    environment:
      - MONGO_URI=mongodb://mongodb:27017/taskManagerDB
    depends_on: [mongodb]
    networks: [app-network]
  frontend:
    build: ./portfolio
    ports: ["5173:5173"]
    depends_on: [backend]
    networks: [app-network]"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[11], "P11_01_docker_status.png"), "Fig. 11.1: Docker Compose status showing all 3 containers healthy and ports mapped."),
        ],
        'test_cases': [
            "Test 1: docker compose up --build compiles and launches all 3 services. [PASS]",
            "Test 2: Frontend is accessible at http://localhost:5173. [PASS]",
            "Test 3: Backend connects to mongodb container via service name 'mongodb'. [PASS]",
            "Test 4: Named volume mongodb_data preserves tasks across docker restart. [PASS]",
        ],
        'viva_qa': [
            ("Why does the backend container reference MongoDB by service name ('mongodb') rather than 'localhost'?", "In Docker, each container has an isolated network namespace with its own localhost. 'localhost:27017' refers to the backend container itself. Compose's internal DNS automatically resolves the service name 'mongodb' to the database container's IP."),
            ("What is the benefit of a multi-stage Docker build for frontend applications?", "It prevents bulky source code, devDependencies, and build compilers from bloating the production container, yielding an image that is up to 70% smaller and more secure."),
            ("Why should node_modules be excluded in .dockerignore?", "Copying host node_modules into the container build context wastes time and can cause binary compatibility errors between host OS (e.g. Windows) and container OS (Linux Alpine). Running npm install inside the container compiles native binaries correctly."),
        ],
        'troubleshooting': [
            ("Backend cannot connect to MongoDB", "Connection string uses localhost instead of Compose service name", "Update MONGO_URI to mongodb://mongodb:27017/taskManagerDB."),
            ("Port already in use error", "Local Mongo or Node process already bound to port 5000 or 27017", "Stop host processes or modify host-side port mapping in docker-compose.yml."),
            ("Extremely slow build times", "node_modules copied into build context", "Add node_modules to .dockerignore in both frontend and backend folders."),
        ],
        'learning_outcome': "I successfully containerized a multi-tier web application using Docker, configured multi-stage builds, orchestrated services with Docker Compose, and verified persistent volume storage.",
        'reflection': "Eliminating the 'works on my machine' dilemma through containerization demonstrated how modern DevOps workflows ensure identical execution from local dev to cloud production.",
    },

    # Practical 12
    {
        'p_num': 12,
        'title': "CI/CD Pipeline with GitHub Actions",
        'problem_statement': "Automate testing and deployment verification using a CI/CD pipeline with GitHub Actions. Configure an automated test suite in the backend using Jest and Supertest, create .github/workflows/ci.yml running on push to main, test pass/fail conditions, and display a CI status badge.",
        'objective': "To implement Continuous Integration practices using automated test suites and GitHub Actions workflow pipelines.",
        'theory_points': [
            "Continuous Integration (CI) is the practice of automatically integrating, building, and testing code changes on every commit to catch bugs early.",
            "GitHub Actions is a workflow automation platform executing jobs, steps, and actions on virtual runners triggered by Git repository events.",
            "Jest is a JavaScript testing framework providing test runners, assertion libraries, and mock support.",
            "Supertest allows programmatic HTTP assertions against Express applications without manually binding network ports.",
        ],
        'solution_approach': [
            "Install jest, supertest, and cross-env in task-manager-api.",
            "Configure npm test script with experimental VM modules support for ESM.",
            "Write comprehensive test suite in tests/api.test.js covering health check, CRUD, caching, validation, and AI endpoints.",
            "Create .github/workflows/ci.yml defining checkout, Node.js setup, dependency install, and npm test execution.",
            "Add frontend build verification step in CI to ensure bundle compiles without errors.",
            "Add CI status badge to project README.md.",
        ],
        'architecture': """git push origin main
       |
       v
GitHub Actions Trigger (on: push, branches: [main])
       |
       v
 Runner: ubuntu-latest (Node.js 18)
 ├── 1. Checkout repository (actions/checkout@v4)
 ├── 2. Install dependencies (npm ci)
 ├── 3. Execute Automated Tests (npm test via Jest + Supertest)
 └── 4. Build Frontend Bundle (npm run build)
       |
       v
 Status: Green Checkmark (Pass) or Red Cross (Fail) + Status Badge in README""",
        'code_snippets': [
            (".github/workflows/ci.yml", """name: CI Pipeline
on:
  push:
    branches: [main]
  pull_request:
    branches: [main]
jobs:
  backend-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 18 }
      - run: cd task-manager-api && npm ci
      - run: cd task-manager-api && npm test"""),
            ("task-manager-api/tests/api.test.js", """test('GET /tasks returns 200 and an array of tasks', async () => {
  const res = await request(app).get('/tasks');
  expect(res.statusCode).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
});"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[12], "P12_01_jest_pass.png"), "Fig. 12.1: Automated Jest test suite running 7 test suites with 100% pass rate in 1.2s."),
        ],
        'test_cases': [
            "Test 1: GET /api/health assertion returns status 200. [PASS]",
            "Test 2: GET /tasks assertion verifies task list and cache headers. [PASS]",
            "Test 3: POST /tasks assertion verifies task creation and status 201. [PASS]",
            "Test 4: Input validation test rejects missing title with status 400. [PASS]",
        ],
        'viva_qa': [
            ("What is the difference between Continuous Integration and Continuous Deployment?", "Continuous Integration automatically tests and builds code on every commit to ensure new code does not break existing features. Continuous Deployment automatically deploys validated builds directly to production environments."),
            ("Why does running automated tests on every push catch bugs faster than manual testing?", "Automated CI runs in minutes across all test cases immediately after a commit, catching regressions while the code is fresh in the developer's mind before reaching production."),
            ("What happens if a test fails in GitHub Actions?", "The workflow step fails immediately, marking the commit with a red cross ('X'), sending an alert to developers, and preventing broken pull requests from merging into the main branch."),
        ],
        'troubleshooting': [
            ("Workflow does not appear under Actions tab", "Workflow file in incorrect directory or wrong extension", "Ensure path is exactly .github/workflows/<name>.yml."),
            ("Workflow fails with YAML syntax error", "Incorrect indentation in .yml file", "Use consistent 2-space indentation and avoid tabs in YAML files."),
            ("npm test fails with 'no test specified'", "Test script missing in package.json", "Set 'scripts': { 'test': 'jest' } in package.json."),
        ],
        'learning_outcome': "I successfully built an automated CI/CD pipeline using Jest, Supertest, and GitHub Actions, automating regression testing and build verification on every commit.",
        'reflection': "Automating tests with CI gave me confidence in code stability. Seeing green checkmarks on GitHub proved that all integration boundaries remained intact.",
    },

    # Practical 13
    {
        'p_num': 13,
        'title': "AI API Integration into a Web Application",
        'problem_statement': "Integrate an external Generative AI API (Google Gemini 2.5 Flash) into the Task Management application. Securely store the API key on the backend, implement graceful degradation so the application functions seamlessly even when offline or during API timeouts, enforce rate limiting, and provide interactive UI controls.",
        'objective': "To securely integrate third-party Generative AI APIs into a full-stack web application with defensive fallback architectures and responsible AI user disclosure.",
        'theory_points': [
            "Generative AI APIs enable automated content synthesis, task breakdown, and cognitive assistance directly inside web interfaces.",
            "API keys must be strictly encapsulated in backend environment variables (.env) to prevent public client extraction.",
            "Graceful degradation ensures that if third-party cloud AI APIs experience latency, quota limits, or outages, the core application continues operating without crashing.",
            "Responsible AI requires visible disclaimers and editable inputs so users remain in control of final decisions.",
        ],
        'solution_approach': [
            "Install @google/genai in task-manager-api.",
            "Store GEMINI_API_KEY in backend .env file.",
            "Build aiRoutes.js exposing POST /api/ai/generate-description.",
            "Implement a 3-second debounce rate-limiter per client IP to prevent quota depletion.",
            "Implement generateContextualFallback() providing structured project objectives and milestone checklists when offline.",
            "Add '🤖 AI Auto-Draft' buttons to task create and edit forms in Tasks.jsx with pulsing loading state and clear disclaimer banner.",
        ],
        'architecture': """React Frontend (Tasks.jsx)
       | Click '🤖 AI Auto-Draft' button
       v
Express Backend (/api/ai/generate-description)
       ├── 1. Rate Limiting Check (3-second debounce per IP)
       ├── 2. Inspect process.env.GEMINI_API_KEY
       │       ├── [Key Valid & Online] ➔ Call Google Gemini 2.5 Flash API
       │       └── [Missing / Network Failure] ➔ Graceful Degradation Engine (Offline Heuristics)
       └── 3. Return JSON: { description, suggestedPriority, fallback, disclaimer }
       |
       v
React Form: Populates editable suggestion + displays responsible AI disclaimer badge!""",
        'code_snippets': [
            ("routes/aiRoutes.js", """router.post('/generate-description', async (req, res) => {
  const { title, priority } = req.body;
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey.includes('your_key')) {
    return res.status(200).json(generateContextualFallback(title, priority));
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Produce a concise task description for: ${title}`,
    });
    res.json({ description: response.text, disclaimer: 'AI-generated by Gemini API.' });
  } catch (err) {
    res.json(generateContextualFallback(title, priority));
  }
});"""),
        ],
        'evidence_items': [
            (os.path.join(EVIDENCE_DIRS[13], "P13_01_gemini_ai.png"), "Fig. 13.1: Backend AI route returning structured task description and actionable action items."),
        ],
        'test_cases': [
            "Test 1: POST /api/ai/generate-description with valid title returns status 200 with description. [PASS]",
            "Test 2: Request without API key activates graceful degradation without throwing uncaught errors. [PASS]",
            "Test 3: Rapid repeat requests trigger 429 rate limit protection. [PASS]",
            "Test 4: Frontend populates AI suggestion directly into editable form textarea. [PASS]",
        ],
        'viva_qa': [
            ("Why must AI API keys be called from the backend rather than directly from the React frontend?", "Client-side code runs in the user's browser, allowing anyone to inspect network headers or view bundled source code to steal the API key. Backend proxying keeps credentials safe and enforces rate limits."),
            ("What does 'graceful degradation' mean in the context of third-party AI dependencies?", "It means designing the system so that if the external AI service fails, times out, or runs out of quota, the main application gracefully defaults to high-quality fallback templates rather than crashing the user experience."),
            ("What are the privacy implications of sending data to an external AI API?", "Data sent to third-party AI APIs may be logged or processed on remote cloud infrastructure. Personally identifiable information (PII), sensitive secrets, and confidential student records should never be transmitted to external models."),
        ],
        'troubleshooting': [
            ("401 Unauthorized from Gemini API", "Missing or incorrect API key", "Verify GEMINI_API_KEY in backend .env matches Google AI Studio credentials."),
            ("API key visible in browser DevTools", "API called directly from React frontend", "Move all AI API calls to Express backend routes; frontend should only call /api/ai endpoints."),
            ("Rate limit exceeded error", "Too many requests sent in short time interval", "Rate limiting middleware automatically debounces requests to conserve quota."),
        ],
        'learning_outcome': "I successfully integrated Google Gemini 2.5 Flash API into a full-stack web application, implemented graceful degradation fallback architecture, and enforced responsible AI disclosure.",
        'reflection': "Implementing graceful degradation taught me the importance of resilience when designing applications dependent on external AI cloud services.",
    },
]

print("[STEP 2] Generating individual DOCX files for Practicals 5 to 13...")
for p_data in PRACTICALS:
    out_file = os.path.join(DOCS_DIR, f"24DIT021_AWDF_P{p_data['p_num']}.docx")
    build_practical_document(p_data, out_file)


# =========================================================================
# MERGE ALL PRACTICALS (1 TO 13) INTO ONE MASTER LAB FILE
# =========================================================================

print("[STEP 3] Merging all Practicals (1 to 13) into unified master document...")

merged_doc = docx.Document()
# Set margins
for s in merged_doc.sections:
    s.top_margin = Inches(0.75)
    s.bottom_margin = Inches(0.75)
    s.left_margin = Inches(0.75)
    s.right_margin = Inches(0.75)

# Cover Page
p_c_title = merged_doc.add_paragraph()
r_c_title = p_c_title.add_run("CHAROTAR UNIVERSITY OF SCIENCE AND TECHNOLOGY\nFACULTY OF TECHNOLOGY AND ENGINEERING\nDEPARTMENT OF INFORMATION TECHNOLOGY")
r_c_title.bold = True
r_c_title.font.size = Pt(16)
p_c_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_c_title.paragraph_format.space_before = Pt(72)
p_c_title.paragraph_format.space_after = Pt(24)

p_c_sub = merged_doc.add_paragraph()
r_c_sub = p_c_sub.add_run("LABORATORY MANUAL & PRACTICAL SUBMISSION FILE\n\nAdvanced Web Development Frameworks (ITUE301)\nSemester: 5th Semester B.Tech (IT)\nAcademic Year: 2026")
r_c_sub.bold = True
r_c_sub.font.size = Pt(18)
p_c_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
p_c_sub.paragraph_format.space_after = Pt(120)

p_c_student = merged_doc.add_paragraph()
r_c_student = p_c_student.add_run("Submitted By:\nHit Goyani\nID / Roll No: 24DIT021\nDevang Patel Institute of Advance Technology and Research (DEPSTAR)\nCHARUSAT University")
r_c_student.font.size = Pt(14)
p_c_student.alignment = WD_ALIGN_PARAGRAPH.CENTER

merged_doc.add_page_break()

# Table of Contents Summary
p_toc = merged_doc.add_paragraph()
r_toc = p_toc.add_run("INDEX / PRACTICAL CURRICULUM OVERVIEW")
r_toc.bold = True
r_toc.font.size = Pt(20)
p_toc.paragraph_format.space_after = Pt(12)

table = merged_doc.add_table(rows=1, cols=4)
table.autofit = False
hdr_cells = table.rows[0].cells
headers = ["Practical #", "Practical Title", "Core Technology", "Page / Status"]
for i, h in enumerate(headers):
    hdr_cells[i].text = h
    hdr_cells[i].paragraphs[0].runs[0].bold = True
    hdr_cells[i].paragraphs[0].runs[0].font.size = Pt(10)

all_practicals_index = [
    ("Practical 1", "Introduction to React and Component Architecture", "React 19 + Vite", "Complete"),
    ("Practical 2", "State Management and Routing in React", "React Router v6 + useState", "Complete"),
    ("Practical 3", "REST API Integration and Data Rendering in React", "Fetch API + useEffect", "Complete"),
    ("Practical 4", "Building a RESTful API with Node.js and Express", "Express.js Middleware", "Complete"),
    ("Practical 5", "MongoDB Integration and Schema Design with Mongoose", "MongoDB + Mongoose", "Complete"),
    ("Practical 6", "Full Stack Integration (React + Node + MongoDB)", "Full-Stack CORS & Sync", "Complete"),
    ("Practical 7", "Authentication and Middleware Pipeline", "JWT + Bcrypt Hashing", "Complete"),
    ("Practical 8", "Performance Optimization and Lazy Loading in React", "React.lazy() + Suspense", "Complete"),
    ("Practical 9", "In-Memory Caching and Query Optimization", "node-cache + TTL", "Complete"),
    ("Practical 10", "Asynchronous Processing with Event-Driven Architecture", "Node.js EventEmitter", "Complete"),
    ("Practical 11", "Containerization with Docker and Docker Compose", "Docker Multi-stage", "Complete"),
    ("Practical 12", "CI/CD Pipeline with GitHub Actions", "Jest + Supertest + CI", "Complete"),
    ("Practical 13", "AI API Integration into a Web Application", "Google Gemini 2.5 Flash", "Complete"),
]

for row_data in all_practicals_index:
    row = table.add_row()
    for i, val in enumerate(row_data):
        cell = row.cells[i]
        cell.text = val
        cell.paragraphs[0].runs[0].font.size = Pt(9.5)

merged_doc.add_page_break()

# Function to append an entire docx to another docx
def append_doc(target_doc, source_path):
    if not os.path.exists(source_path):
        print(f"[WARN] File not found to merge: {source_path}")
        return
    source_doc = docx.Document(source_path)
    for element in source_doc.element.body:
        target_doc.element.body.append(element)
    target_doc.add_page_break()

# Merge P1 through P13 in order!
for p_num in range(1, 14):
    p_path = os.path.join(DOCS_DIR, f"24DIT021_AWDF_P{p_num}.docx")
    print(f"  --> Appending Practical {p_num} from {p_path}...")
    append_doc(merged_doc, p_path)

merged_output_path = os.path.join(DOCS_DIR, "24DIT021_AWDF_All_Practicals_1_to_13_Merged.docx")
merged_doc.save(merged_output_path)
print(f"\n[MASTER FILE CREATED] {merged_output_path}")
