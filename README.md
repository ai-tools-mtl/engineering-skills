# Engineering Skills

A collection of engineering skills for AI coding agents. Skills are packaged instructions that extend agent capabilities with industry-standard coding conventions from Alibaba f2e-spec, Java Development Manual, and Python community best practices.

Skills follow the [Agent Skills](https://agentskills.io/) format.

## Available Skills

### f2e-engineering

Enforces Alibaba front-end engineering standards for Git commits, API design, documentation, and changelogs.

**Use when:**
- Writing Git commit messages
- Designing RESTful APIs
- Writing documentation or changelogs
- Following front-end engineering conventions

### f2e-javascript

Enforces Alibaba front-end coding standards for JavaScript and TypeScript code.

**Use when:**
- Writing .js, .jsx, .ts, or .tsx files
- Reviewing JavaScript/TypeScript code
- Following JS/TS coding conventions

### f2e-markup

Enforces Alibaba front-end coding standards for HTML, CSS, Sass, and Less.

**Use when:**
- Writing .html, .css, .scss, .less, or .sass files
- Reviewing markup or styling code
- Following HTML/CSS conventions

### f2e-node

Enforces Alibaba front-end coding standards for Node.js server-side development.

**Use when:**
- Writing Express/Koa server code
- Building Node.js APIs
- Following Node.js coding conventions

### f2e-react

Enforces Alibaba front-end coding standards for React components, hooks, and JSX.

**Use when:**
- Writing React components or hooks
- Building JSX/TSX files
- Following React coding conventions

### java-coding-standards

Alibaba Java coding standards covering naming style, constants, code format, OOP, date/time, collections, concurrency, control statements, and comments.

**Use when:**
- Writing Java code
- Reviewing Java code
- Following Alibaba Java coding standards

### java-design-standards

Alibaba Java design standards covering software architecture, design patterns, and design principles.

**Use when:**
- Designing software architecture
- Applying design patterns
- Making design decisions in Java projects

### java-exception-logging

Alibaba Java exception and logging standards covering error codes, exception handling, and logging rules.

**Use when:**
- Handling exceptions in Java
- Configuring logging
- Designing error code systems

### java-mysql-database

Alibaba Java MySQL database standards covering table design, indexing, SQL statements, and ORM mapping.

**Use when:**
- Designing database schemas
- Writing SQL queries
- Working with MySQL in Java applications

### java-project-structure

Alibaba Java project structure standards covering application layering, library dependencies, and server setup.

**Use when:**
- Structuring Java projects
- Managing dependencies
- Organizing project architecture

### java-security-standards

Alibaba Java security standards covering XSS, CSRF, SQL injection prevention, and data masking.

**Use when:**
- Implementing authentication or authorization
- Handling user input securely
- Preventing OWASP vulnerabilities

### java-unit-testing

Alibaba Java unit testing standards following AIR and BCDE principles.

**Use when:**
- Writing JUnit tests
- Designing test cases
- Reviewing test quality

### python-coding-standards

PEP 8 and community best-practice coding standards covering naming, formatting, Pythonic idioms, data structures, strings, iterators/generators, and docstrings.

**Use when:**
- Writing Python code
- Reviewing Python code
- Following PEP 8 standards

### python-type-hints

Python type system standards covering type annotations, mypy configuration, Pydantic models, generics, Protocol, and TypeVar.

**Use when:**
- Writing type hints
- Configuring mypy
- Building Pydantic models
- Designing typed APIs

### python-design-standards

Python design principles and project structure standards covering SOLID, design patterns, layered architecture, and dependency management.

**Use when:**
- Designing Python project architecture
- Organizing modules
- Making design decisions

### python-exception-logging

Python exception handling and logging standards covering exception hierarchy, structured logging, and error code systems.

**Use when:**
- Handling exceptions in Python
- Configuring structured logging
- Designing error handling strategies

### python-database

Python database operation standards covering SQLAlchemy 2.0, Django ORM, connection pool management, and migration strategies.

**Use when:**
- Writing database queries
- Designing schemas
- Configuring ORM in Python projects

### python-web-api

Python Web/API development standards covering FastAPI, Django REST, Flask conventions, RESTful design, and async processing.

**Use when:**
- Building REST APIs with FastAPI or Django
- Designing API endpoints
- Working with Flask or FastAPI

### python-security-standards

Python security development standards covering input validation, SQL injection prevention, XSS prevention, authentication, and key management.

**Use when:**
- Implementing security features
- Handling user input
- Configuring authentication

### python-unit-testing

Python unit testing standards covering pytest best practices, mock strategies, coverage requirements, and fixtures design.

**Use when:**
- Writing pytest tests
- Setting up test infrastructure
- Reviewing test quality

### pua

Forces high-agency exhaustive problem-solving with corporate PUA pressure across all task types.

**Use when:**
- User frustration or repeated failures
- Passive agent behavior
- Quality complaints
- Need for maximum effort output

## Installation

```bash
npx add-skill ai-tools-mtl/engineering-skills
```

## Usage

Skills are automatically available once installed. The agent will use them when relevant tasks are detected.

**Examples:**
```
Review this Python code for PEP 8 compliance
```
```
Help me design a MySQL schema following Alibaba standards
```
```
Audit this React component for best practices
```

## Skill Structure

Each skill contains:
- `SKILL.md` - Instructions for the agent
- `scripts/` - Helper scripts for automation (optional)
- `references/` - Supporting documentation (optional)

## License

MIT
