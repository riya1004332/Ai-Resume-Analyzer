-- Seed Initial Skills Library
INSERT INTO public.skills (name, category, description)
VALUES
    -- Software Development
    ('JavaScript', 'Software Development', 'Core programming language of the web'),
    ('TypeScript', 'Software Development', 'Typed superset of JavaScript'),
    ('React', 'Software Development', 'Component-based frontend library'),
    ('Next.js', 'Software Development', 'Full-stack React framework'),
    ('Node.js', 'Software Development', 'Server-side JavaScript runtime environment'),
    ('Express.js', 'Software Development', 'Minimalist web framework for Node.js'),
    ('Python', 'Software Development', 'High-level multipurpose programming language'),
    ('Java', 'Software Development', 'Object-oriented enterprise programming language'),
    ('C#', 'Software Development', 'Modern, type-safe programming language for .NET'),
    ('REST API', 'Software Development', 'Representational State Transfer web services architecture'),
    ('GraphQL', 'Software Development', 'Query language and server runtime for APIs'),
    ('Git', 'Software Development', 'Distributed version control system'),
    ('HTML5/CSS3', 'Software Development', 'Standard markup and styling languages for web documents'),
    ('Tailwind CSS', 'Software Development', 'Utility-first CSS framework for modern interfaces'),

    -- Data & AI
    ('SQL', 'Data & AI', 'Relational database query and management language'),
    ('PostgreSQL', 'Data & AI', 'Advanced open-source relational database management system'),
    ('MongoDB', 'Data & AI', 'Document-oriented NoSQL database'),
    ('Data Analysis', 'Data & AI', 'Inspecting, cleansing, and modeling data to discover insights'),
    ('Pandas', 'Data & AI', 'Python data manipulation and analysis library'),
    ('NumPy', 'Data & AI', 'Numerical computing and array processing library for Python'),
    ('Machine Learning', 'Data & AI', 'Algorithms that improve automatically through experience and data'),
    ('Deep Learning', 'Data & AI', 'Neural network models capable of learning representation hierarchies'),
    ('Google Gemini API', 'Data & AI', 'Multimodal LLM integration and generative AI applications'),
    ('Prompt Engineering', 'Data & AI', 'Designing and refining prompts for optimal AI model outputs'),
    ('Data Visualization', 'Data & AI', 'Graphical representation of information and data'),

    -- Cloud & DevOps
    ('Docker', 'Cloud & DevOps', 'Containerization platform to package applications and dependencies'),
    ('Kubernetes', 'Cloud & DevOps', 'Container orchestration system for automating deployment and scaling'),
    ('CI/CD', 'Cloud & DevOps', 'Continuous integration and continuous deployment automation pipelines'),
    ('AWS', 'Cloud & DevOps', 'Amazon Web Services cloud computing platform'),
    ('Microsoft Azure', 'Cloud & DevOps', 'Microsoft enterprise cloud platform'),
    ('Linux', 'Cloud & DevOps', 'Open-source Unix-like operating system administration'),
    ('Terraform', 'Cloud & DevOps', 'Infrastructure as Code software tool'),

    -- Cybersecurity & Networking
    ('Network Security', 'Cybersecurity', 'Securing network infrastructure and data transmissions'),
    ('Penetration Testing', 'Cybersecurity', 'Authorized simulated cyberattack on computer systems'),
    ('Vulnerability Assessment', 'Cybersecurity', 'Identifying and evaluating security vulnerabilities'),
    ('OWASP Top 10', 'Cybersecurity', 'Standard awareness document for web application security risks'),
    ('Cryptography', 'Cybersecurity', 'Techniques for secure communication in the presence of adversaries'),

    -- Design & Digital Products
    ('UI/UX Design', 'Design', 'User interface and user experience design principles'),
    ('Figma', 'Design', 'Collaborative interface design tool'),
    ('Wireframing', 'Design', 'Schematic blueprint representing layout and user workflows'),
    ('Responsive Design', 'Design', 'Designing web applications that adapt to all screen sizes'),

    -- Business & Soft Skills
    ('Agile/Scrum', 'Management', 'Iterative software development management framework'),
    ('Technical Communication', 'Soft Skills', 'Communicating complex technical concepts clearly to diverse audiences'),
    ('Problem Solving', 'Soft Skills', 'Analytical and systematic approach to resolving complex issues'),
    ('Project Management', 'Management', 'Planning, executing, and closing projects to achieve specific goals')
ON CONFLICT (name) DO NOTHING;

