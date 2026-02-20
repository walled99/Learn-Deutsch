# 📘 Supabase Setup Documentation

**Project:** LernDeutsch AI

This document describes the exact steps to initialize, configure, and secure the Supabase backend for the LernDeutsch AI project.

---

## Step 1: Initialize the Project

### 1.1 Create a Supabase Project

- Open the [Supabase Dashboard](https://app.supabase.com/).
- Click **New Project** and follow the instructions.

### 1.2 Save Credentials Securely

After project creation, securely store the following:

- **Project Password**
- **Anon API Key**
- **Service Role API Key**

> ⚠️ These keys are required for backend access and **must never be exposed publicly**.

### 1.3 Set Project Region

- **Region:** Frankfurt (eu-central-1)
- **Reason:** Hosting in Frankfurt reduces latency for Germany-focused users.

---

## Step 2: Define the Database Schema (SQL Editor)

All database structures are created using the **Supabase SQL Editor**.

### 2.1 Purpose

This schema:

- Enforces strict data integrity
- Matches functional requirements FR-3.2 and FR-5
- Prevents duplicate vocabulary entries
- Links all user data to Supabase Auth users

### 2.2 Create Custom ENUM Types

sql
CREATE TYPE word_category AS ENUM ('Noun', 'Verb', 'Adjective', 'Adverb', 'Phrase');
CREATE TYPE mastery_status AS ENUM ('New', 'Learning', 'Reviewing', 'Mastered');
CREATE TYPE gender_article AS ENUM ('der', 'die', 'das');
CREATE TYPE helper_verb AS ENUM ('haben', 'sein');
### 2.3 Create the vocabulary Table (Status: Column 'comparative' removed from app service)
CREATE TABLE vocabulary (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  word TEXT NOT NULL,
  article gender_article,
  plural TEXT,
  helper_verb helper_verb,
  past_participle TEXT,
  translation TEXT NOT NULL,
  example TEXT,
  category word_category NOT NULL,
  status mastery_status DEFAULT 'New',
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word, category)
);

> [!NOTE]
> The `comparative` column was originally planned but removed from active service calls in February 2026 to ensure database compatibility.
Key Design Decisions:

Each vocabulary entry belongs to one authenticated user.

UNIQUE(user_id, word, category) prevents duplicates per user.

Optional grammar fields support German language structure.

2.4 Create the profiles Table
CREATE TABLE profiles (
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
display_name TEXT,
avatar_url TEXT,
updated_at TIMESTAMPTZ DEFAULT NOW()
);
Step 3: Security & Row Level Security (RLS)
3.1 Purpose
Users must never see or modify other users’ data.

3.2 Enable RLS
ALTER TABLE vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
3.3 Create Vocabulary Access Policy
CREATE POLICY "Users can manage their own vocabulary"
ON vocabulary
FOR ALL
USING (auth.uid() = user_id);
Effect:

Full isolation between users

Queries are automatically filtered by auth.uid()

No client-side filtering required

Step 4: Profiles Table Policies

Run these policies so users can read, create, and update their own profile:

CREATE POLICY "Users can read own profile"
ON profiles FOR SELECT
USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
ON profiles FOR INSERT
WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
ON profiles FOR UPDATE
USING (auth.uid() = id);

5.1 Create the "Insert" (Upload) Policy
Click New Policy → Full Customization

Policy Name: Allow authenticated uploads

Allowed Operations: INSERT

Target Roles: authenticated

Check Expression: auth.uid() = owner

Save policy.

5.2 Create the "Select" (View) Policy
Click New Policy → Full Customization

Policy Name: Allow users to view own images

Allowed Operations: SELECT

Target Roles: authenticated

Check Expression: auth.uid() = owner

Save policy.

5.3 Policy Summary
Policy Type Operation Who Can Do It Which Files
Insert Upload Authenticated users Only files they own
Select View Authenticated users Only files they uploaded
✅ Final Result
Each user has fully isolated data.

Vocabulary is structured, validated, and duplicate-safe.

Images are securely stored and access-controlled.

Backend supports OCR + Gemini processing.

Supabase Auth, Database, RLS, and Storage are fully integrated.
