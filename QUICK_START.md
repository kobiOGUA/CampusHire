# ⚡ CampusHire - Quick Start Checklist

## 🎯 In 5 Minutes

- [ ] Open `index.html` in browser
- [ ] Click "Register"
- [ ] Create a student account
- [ ] Login
- [ ] Explore student dashboard
- [ ] Go back and register as recruiter
- [ ] Login as recruiter
- [ ] Post a job
- [ ] Logout
- [ ] Login as student
- [ ] Apply for job
- [ ] View application status

## 📋 Complete Setup Checklist

### Phase 1: Initial Setup (5 minutes)
- [ ] Open `c:\Users\kobio\OneDrive\Desktop\CampusHire\index.html`
- [ ] Bookmark the page
- [ ] Test that homepage loads correctly
- [ ] Verify all buttons work

### Phase 2: Registration (10 minutes)
- [ ] Register Student Account
  - [ ] Name: Test Student
  - [ ] Email: student@test.com
  - [ ] Password: Test123!
  - [ ] Role: Student
- [ ] Register Recruiter Account
  - [ ] Name: Test Recruiter
  - [ ] Email: recruiter@test.com
  - [ ] Password: Test123!
  - [ ] Role: Recruiter
- [ ] Create Admin Account (One time)
  - [ ] Go to `/admin_register.html`
  - [ ] Name: Admin User
  - [ ] Email: admin@test.com
  - [ ] Password: Admin123!

### Phase 3: Student Testing (15 minutes)
- [ ] Login as student
- [ ] View student dashboard
- [ ] Upload profile picture
- [ ] Fill in "About Me"
- [ ] Add skills
- [ ] Fill in education details
- [ ] Fill in work experience
- [ ] Save profile
- [ ] Upload CV file
- [ ] View profile picture
- [ ] Verify CV was uploaded
- [ ] Go to job board
- [ ] Browse available jobs
- [ ] Search for a specific job
- [ ] Filter by company
- [ ] Apply for a job
- [ ] See "Applied" status
- [ ] Try to apply again (should be disabled)
- [ ] Check "My Applications" section
- [ ] Logout

### Phase 4: Recruiter Testing (15 minutes)
- [ ] Login as recruiter
- [ ] View recruiter dashboard
- [ ] Post a new job
  - [ ] Title: "Frontend Developer"
  - [ ] Company: "Tech Company"
  - [ ] Description: "Seeking talented frontend developer"
- [ ] See job appear in "My Posted Jobs"
- [ ] View job details
- [ ] Click "View Applicants"
- [ ] See student applicant
- [ ] Click on applicant profile
- [ ] View student's full profile
- [ ] See application status dropdown
- [ ] Change status to "Shortlisted"
- [ ] Go back to jobs list
- [ ] Close a job posting
- [ ] Verify job status changes to "Closed"
- [ ] Logout

### Phase 5: Admin Testing (20 minutes)
- [ ] Login as admin
- [ ] View admin dashboard
- [ ] Check statistics (students, recruiters, jobs count)
- [ ] Go to "Manage Users"
  - [ ] See all users listed
  - [ ] Search for a user by name
  - [ ] Search for a user by email
  - [ ] Filter by role (Student)
  - [ ] Filter by role (Recruiter)
  - [ ] Verify you cannot delete admin
- [ ] Go to "Manage Jobs"
  - [ ] See all jobs listed
  - [ ] Search for a job by title
  - [ ] Search for a job by company
  - [ ] Filter by status (Active)
  - [ ] Filter by status (Closed)
  - [ ] See application count per job
- [ ] Go to "Reports"
  - [ ] View total statistics
  - [ ] View job statistics
  - [ ] View application breakdown
  - [ ] View top recruiters
  - [ ] View top jobs
- [ ] Logout

### Phase 6: Edge Cases (10 minutes)
- [ ] Try to access student_dashboard.html without login (should redirect)
- [ ] Try to access admin_dashboard.html as student (should redirect)
- [ ] Try to access admin_manage_users.html as recruiter (should redirect)
- [ ] Test search with no results
- [ ] Test rapid button clicks
- [ ] Test mobile responsiveness (resize browser)
- [ ] Test on different browser if possible

### Phase 7: UI/UX Verification (10 minutes)
- [ ] All pages load within 2 seconds
- [ ] All buttons have hover effects
- [ ] All forms show validation messages
- [ ] Status messages appear and disappear correctly
- [ ] Colors are consistent across pages
- [ ] Fonts are readable at 100% zoom
- [ ] No console errors (press F12)
- [ ] Mobile layout looks good at 375px width

---

## 📊 Expected Results

### After Student Registration & Profile Setup
- [ ] Profile picture displayed as circular image
- [ ] All form fields saved correctly
- [ ] CV shows in downloads
- [ ] "About Me" displays on public profile

### After Job Application
- [ ] Status shows "Applied" with date
- [ ] Button becomes disabled
- [ ] Can view in "My Applications"
- [ ] Recruiter can see applicant

### After Recruiter Updates Status
- [ ] Student sees new status in real-time
- [ ] Status color changes (green for shortlist, red for reject)
- [ ] History is retained

### After Admin Actions
- [ ] User counts update correctly
- [ ] Reports show accurate data
- [ ] Deletions remove user/job immediately
- [ ] Searches work across all pages

---

## 🔧 If Something Doesn't Work

**Browser Console (F12)**
- Look for red error messages
- Check for network errors
- Verify Firebase is connected

**Common Fixes**
- [ ] Clear browser cache (Ctrl+Shift+Del)
- [ ] Refresh page (Ctrl+R)
- [ ] Hard refresh (Ctrl+Shift+R)
- [ ] Try different browser
- [ ] Check if Firefox blocking ads/scripts

**Firebase Connection**
- [ ] Console should say "✅ Firebase Initialized"
- [ ] Check internet connection
- [ ] Verify database has data in Firebase Console

---

## ✨ Success Indicators

You'll know everything is working when:

✅ Users can create accounts  
✅ Profiles save and persist  
✅ Jobs appear on job board  
✅ Applications track status  
✅ Admin pages show correct data  
✅ All pages style correctly  
✅ Mobile view works smoothly  
✅ No red errors in console  

---

## 📱 Responsive Testing

Test on these viewport sizes:
- [ ] Desktop: 1920x1080
- [ ] Laptop: 1366x768
- [ ] Tablet: 768x1024
- [ ] Mobile: 375x667
- [ ] Small Mobile: 320x480

All should look good and be usable!

---

## 🎓 You're Done!

Once you've checked all these items, your CampusHire platform is **fully validated and ready**! 

**Estimated Total Time: 90 minutes**

---

**Created**: November 12, 2025  
**Status**: Complete ✅
