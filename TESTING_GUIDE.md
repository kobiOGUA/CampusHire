# CampusHire - Quick Testing Guide

## 🚀 Getting Started

### Step 1: Access the Application
Open in your browser: `file:///c:/Users/kobio/OneDrive/Desktop/CampusHire/index.html`

Or navigate to the folder and open `index.html`

---

## 👥 Test Accounts Setup

### For Testing - Create These Accounts:

#### **Student Account**
1. Click "Register" on home page
2. Fill in:
   - Name: `John Student`
   - Email: `student@test.com`
   - Password: `Test123!`
   - Role: **Student**
3. Login and explore student dashboard

#### **Recruiter Account**
1. Click "Register" on home page
2. Fill in:
   - Name: `Jane Recruiter`
   - Email: `recruiter@test.com`
   - Password: `Test123!`
   - Role: **Recruiter**
3. Login and explore recruiter dashboard

#### **Admin Account** (First Time Only)
1. Go directly to: `/admin_register.html`
2. Fill in:
   - Name: `Admin User`
   - Email: `admin@test.com`
   - Password: `Admin123!`
3. Click "Create Admin"
4. Login with those credentials
5. Access admin dashboard

---

## ✅ Features to Test

### **Student Features** (Login as student)
- [ ] Complete profile with education and experience
- [ ] Upload a CV file
- [ ] Browse job board
- [ ] Search and filter jobs
- [ ] Apply for a job
- [ ] Check application status
- [ ] View profile before applying

### **Recruiter Features** (Login as recruiter)
- [ ] Post a new job
- [ ] View posted jobs
- [ ] View applicants for a job
- [ ] Click on applicant to view profile
- [ ] Update applicant status (Pending → Shortlisted, etc.)
- [ ] Close a job posting

### **Admin Features** (Login as admin)
- [ ] Go to "Manage Users" - view all registered users
- [ ] Search and filter users by role
- [ ] Delete a user (except admins)
- [ ] Go to "Manage Jobs" - view all jobs
- [ ] Search jobs by title or company
- [ ] Filter active vs closed jobs
- [ ] Delete a job posting
- [ ] Go to "Reports" - view analytics dashboard
  - View total counts (students, recruiters, jobs, applications)
  - View active/closed job statistics
  - See application status breakdown
  - View top recruiters and most applied jobs

---

## 🎯 Key Pages to Test

| Page | URL | Access |
|------|-----|--------|
| Home | `index.html` | Public |
| Login | `login.html` | Public |
| Register | `register.html` | Public |
| Admin Register | `admin_register.html` | Public (first time only) |
| Student Dashboard | `student_dashboard.html` | After login as student |
| Recruiter Dashboard | `recruiter_dashboard.html` | After login as recruiter |
| Admin Dashboard | `admin_dashboard.html` | After login as admin |
| Manage Users | `admin_manage_users.html` | Admin only |
| Manage Jobs | `admin_manage_jobs.html` | Admin only |
| Reports | `admin_reports.html` | Admin only |
| Job Board | `job_board.html` | Student only |

---

## 🎨 UI/UX Checkpoints

- [ ] Pages are responsive on mobile (resize browser to test)
- [ ] Buttons have hover effects
- [ ] Forms validate inputs
- [ ] Success messages appear after actions
- [ ] Error messages are clear
- [ ] Navigation between pages works smoothly
- [ ] Page titles are appropriate

---

## 🐛 Common Issues & Solutions

### Issue: Pages not styling properly
**Solution:** Ensure `css/style.css` is in the correct location and all HTML files link to it with `href="css/style.css"`

### Issue: Firebase errors in console
**Solution:** Check browser console for errors. Ensure Firebase config is correct in JS files.

### Issue: Admin register page only works once
**Solution:** This is by design - only the first admin can be created. After that, admin routes are protected.

### Issue: Can't see applicants for a job
**Solution:** 
1. Post a job as recruiter
2. Switch to student account
3. Apply for that job
4. Switch back to recruiter and refresh
5. Click "View Applicants"

---

## 📊 What Each Admin Page Shows

### **Manage Users**
- List of all registered users
- Shows: Name, Email, Role, Company
- Search by name/email
- Filter by role
- Delete user option

### **Manage Jobs**
- List of all job postings
- Shows: Title, Company, Status, Application count
- Search by title/company/description
- Filter by active/closed status
- Delete job option

### **Reports (Analytics)**
- **Stats Cards:** Total students, recruiters, jobs, applications
- **Job Statistics:** Active/closed jobs, average applications
- **Application Breakdown:** By status (Pending, Shortlisted, etc.)
- **Top Recruiters:** Most active recruiters by job count
- **Top Jobs:** Most applied-for positions

---

## 💡 Tips for Testing

1. **Test in Incognito Mode** for separate login sessions
2. **Check Browser Console** (F12) for any JavaScript errors
3. **Test on Mobile** - Resize browser window to test responsive design
4. **Use Different Browsers** if possible (Chrome, Firefox, Safari, Edge)
5. **Test Edge Cases** - Try empty searches, rapid clicks, etc.

---

## 📝 Notes

- All data is stored in Firebase Firestore
- Images are stored as base64 in database
- File sizes are limited (CVs max ~900KB)
- All timestamps use ISO format

**Happy Testing! 🎉**
