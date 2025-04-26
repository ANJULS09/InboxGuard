document.addEventListener("DOMContentLoaded", () => {
  // DOM Elements
  const loginSection = document.getElementById("login-section")
  const appContainer = document.getElementById("app-container")
  const loginForm = document.getElementById("login-form")
  const signupForm = document.getElementById("signup-form")
  const loginTab = document.getElementById("login-tab")
  const signupTab = document.getElementById("signup-tab")
  const loginFormContainer = document.getElementById("login-form-container")
  const signupFormContainer = document.getElementById("signup-form-container")
  const showSignupLink = document.getElementById("show-signup")
  const showLoginLink = document.getElementById("show-login")
  const spamForm = document.getElementById("spam-form")
  const emailContent = document.getElementById("email-content")
  const clearBtn = document.getElementById("clear-btn")
  const result = document.getElementById("result")
  const resultTitle = document.getElementById("result-title")
  const progressBar = document.getElementById("progress-bar")
  const confidence = document.getElementById("confidence")
  const featureList = document.getElementById("feature-list")
  const contactForm = document.getElementById("contact-form")
  const contactFormContainer = document.getElementById("contact-form-container")
  const contactSuccess = document.getElementById("contact-success")
  const currentYear = document.getElementById("current-year")
  const passwordInput = document.getElementById("signup-password")
  const confirmPasswordInput = document.getElementById("signup-confirm-password")
  const passwordStrengthMeter = document.getElementById("password-strength-meter")
  const passwordStrengthText = document.getElementById("password-strength-text")
  const themeToggle = document.getElementById("theme-toggle")
  const editProfileBtn = document.querySelector(".profile-actions .btn-primary")
  const changePasswordBtn = document.querySelector(".profile-actions .btn-outline")

  // Set current year in footer
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear()
  }

  // Check if user is logged in
  function checkLoginStatus() {
    // Always show login section when the page reloads
    localStorage.removeItem("isLoggedIn"); // Remove login state on each reload

    document.getElementById("login-section").classList.remove("hidden");
    document.getElementById("app-container").classList.add("hidden");
}


// Run login check as soon as the page loads
document.addEventListener("DOMContentLoaded", checkLoginStatus);

  
  // Load profile data from localStorage
  function loadProfileData() {
    const profileData = JSON.parse(localStorage.getItem("profileData") || "{}")
    
    if (Object.keys(profileData).length > 0) {
      const profileName = document.getElementById("profile-name")
      const profileEmail = document.getElementById("profile-email")
      
      if (profileName && profileData.name) {
        profileName.textContent = profileData.name
      }
      
      if (profileEmail && profileData.email) {
        profileEmail.textContent = profileData.email
      }
      
      // Update other profile fields if they exist
      const locationElement = document.querySelector(".detail-item:nth-child(3) .detail-value")
      if (locationElement && profileData.location) {
        locationElement.textContent = profileData.location
      }
    }
  }

  // Run login check on page load
  checkLoginStatus()

  // Theme toggle
  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      document.body.classList.toggle("dark")

      if (document.body.classList.contains("dark")) {
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
      } else {
        themeToggle.innerHTML = '<i class="fas fa-moon"></i>'
      }
    })
  }

  // Check for saved theme preference
  if (
    localStorage.getItem("theme") === "dark" ||
    (!localStorage.getItem("theme") && window.matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.body.classList.add("dark")
    if (themeToggle) {
      themeToggle.innerHTML = '<i class="fas fa-sun"></i>'
    }
  }

  // Save theme preference
  const saveThemePreference = () => {
    localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light")
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", saveThemePreference)
  }

  // Tab switching
  if (loginTab && signupTab) {
    loginTab.addEventListener("click", () => {
      loginTab.classList.add("active")
      signupTab.classList.remove("active")
      loginFormContainer.classList.remove("hidden")
      signupFormContainer.classList.add("hidden")
    })

    signupTab.addEventListener("click", () => {
      signupTab.classList.add("active")
      loginTab.classList.remove("active")
      signupFormContainer.classList.remove("hidden")
      loginFormContainer.classList.add("hidden")
    })
  }

  // Link switching
  if (showSignupLink && showLoginLink) {
    showSignupLink.addEventListener("click", (e) => {
      e.preventDefault()
      signupTab.click()
    })

    showLoginLink.addEventListener("click", (e) => {
      e.preventDefault()
      loginTab.click()
    })
  }

  // Password strength meter
  if (passwordInput && passwordStrengthMeter) {
    passwordInput.addEventListener("input", () => {
      const password = passwordInput.value
      let strength = 0
      let strengthClass = ""
      let strengthText = ""

      // Check password length
      if (password.length > 0) {
        strength += password.length > 7 ? 25 : 10
      }

      // Check for mixed case
      if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
        strength += 25
      }

      // Check for numbers
      if (password.match(/\d/)) {
        strength += 25
      }

      // Check for special characters
      if (password.match(/[^a-zA-Z\d]/)) {
        strength += 25
      }

      // Set strength text and class
      if (strength < 30) {
        strengthClass = "strength-weak"
        strengthText = "Weak"
      } else if (strength < 70) {
        strengthClass = "strength-medium"
        strengthText = "Medium"
      } else {
        strengthClass = "strength-strong"
        strengthText = "Strong"
      }

      // Update UI
      passwordStrengthMeter.innerHTML = `<div class="${strengthClass}" style="width: ${strength}%"></div>`
      passwordStrengthText.textContent = `Password strength: ${strengthText}`
    })
  }

  // Spam indicators
  const spamIndicators = [
    // Phishing indicators
    { term: "verify your account", weight: 0.8, category: "Phishing" },
    { term: "confirm your details", weight: 0.7, category: "Phishing" },
    { term: "login information", weight: 0.7, category: "Phishing" },
    { term: "update your payment", weight: 0.8, category: "Phishing" },
    { term: "suspicious activity", weight: 0.7, category: "Phishing" },
    { term: "click here to verify", weight: 0.9, category: "Phishing" },
    { term: "security alert", weight: 0.6, category: "Phishing" },

    // Promotional indicators
    { term: "free", weight: 0.6, category: "Promotion" },
    { term: "discount", weight: 0.5, category: "Promotion" },
    { term: "sale", weight: 0.4, category: "Promotion" },
    { term: "offer", weight: 0.5, category: "Promotion" },
    { term: "limited time", weight: 0.5, category: "Promotion" },
    { term: "buy now", weight: 0.6, category: "Promotion" },
    { term: "exclusive deal", weight: 0.5, category: "Promotion" },
    { term: "coupon", weight: 0.4, category: "Promotion" },

    // Scam indicators
    { term: "prize", weight: 0.8, category: "Scam" },
    { term: "winner", weight: 0.8, category: "Scam" },
    { term: "lottery", weight: 0.9, category: "Scam" },
    { term: "million dollars", weight: 0.9, category: "Scam" },
    { term: "inheritance", weight: 0.9, category: "Scam" },
    { term: "claim your reward", weight: 0.8, category: "Scam" },
    { term: "wire transfer", weight: 0.7, category: "Scam" },
    { term: "urgent", weight: 0.7, category: "Scam" },

    // Malware indicators
    { term: "attachment", weight: 0.6, category: "Malware" },
    { term: "download", weight: 0.6, category: "Malware" },
    { term: "invoice attached", weight: 0.7, category: "Malware" },
    { term: "document shared", weight: 0.5, category: "Malware" },
    { term: "enable macros", weight: 0.9, category: "Malware" },
    { term: "exe file", weight: 0.9, category: "Malware" },
    { term: "zip file", weight: 0.7, category: "Malware" },

    // Social Engineering indicators
    { term: "urgent assistance", weight: 0.8, category: "Social Engineering" },
    { term: "help needed", weight: 0.6, category: "Social Engineering" },
    { term: "are you available", weight: 0.5, category: "Social Engineering" },
    { term: "request from", weight: 0.6, category: "Social Engineering" },
    { term: "your boss", weight: 0.7, category: "Social Engineering" },
    { term: "confidential", weight: 0.6, category: "Social Engineering" },
    { term: "do not share", weight: 0.5, category: "Social Engineering" },

    // General spam indicators
    { term: "viagra", weight: 0.9, category: "Scam" },
    { term: "cash", weight: 0.6, category: "Scam" },
    { term: "credit card", weight: 0.5, category: "Phishing" },
    { term: "act now", weight: 0.6, category: "Promotion" },
    { term: "guarantee", weight: 0.4, category: "Promotion" },
    { term: "no risk", weight: 0.6, category: "Scam" },
    { term: "click here", weight: 0.5, category: "Phishing" },
    { term: "suspicious links", weight: 0.7, category: "Malware" },
  ]

  // Login form submission
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const email = document.getElementById("login-email").value
      const password = document.getElementById("login-password").value
      const rememberMe = document.getElementById("login-remember").checked

      // In a real app, you would validate credentials here

      // Save login state
      localStorage.setItem("isLoggedIn", "true")
      
      // Create initial profile data if it doesn't exist
      if (!localStorage.getItem("profileData")) {
        // Extract name from email for profile display
        const nameFromEmail = email.split("@")[0].replace(/[.]/g, " ")
        const formattedName = nameFromEmail
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ")
          
        const initialProfileData = {
          name: formattedName,
          email: email,
          location: "New York, USA"
        }
        
        localStorage.setItem("profileData", JSON.stringify(initialProfileData))
      }

      // Update profile information with the logged in user's email
      const profileData = JSON.parse(localStorage.getItem("profileData"))
      
      // Extract name from email for profile display
      const nameFromEmail = email.split("@")[0].replace(/[.]/g, " ")
      const formattedName = nameFromEmail
        .split(" ")
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(" ")
      
      if (document.getElementById("profile-email")) {
        document.getElementById("profile-email").textContent = profileData.email || email
      }
      
      if (document.getElementById("profile-name")) {
        document.getElementById("profile-name").textContent = profileData.name || formattedName
      }

      loginSection.classList.add("hidden")
      appContainer.classList.remove("hidden")
    })
  }

  // Sign up form submission
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = document.getElementById("signup-name").value
      const email = document.getElementById("signup-email").value
      const password = document.getElementById("signup-password").value
      const confirmPassword = document.getElementById("signup-confirm-password").value

      // Check if passwords match
      if (password !== confirmPassword) {
        alert("Passwords do not match!")
        return
      }

      // In a real app, you would create the user in the database
      alert("Account created successfully! Please log in.")
      loginTab.click()
    })
  }

  // Clear form
  if (clearBtn) {
    clearBtn.addEventListener("click", () => {
      emailContent.value = ""
      result.classList.add("hidden")
      emailContent.focus()
    })
  }

  // Analyze email
  if (spamForm) {
    spamForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const analyzeBtn = document.getElementById("analyze-btn")
      analyzeBtn.disabled = true
      analyzeBtn.textContent = "Analyzing..."

      const content = emailContent.value

      if (!content.trim()) {
        alert("Please enter some email content to analyze.")
        analyzeBtn.disabled = false
        analyzeBtn.textContent = "Analyze Email"
        return
      }

      setTimeout(() => {
        analyzeEmail(content)
        analyzeBtn.disabled = false
        analyzeBtn.textContent = "Analyze Email"
      }, 800)
    })
  }

  // Contact form submission
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()
      const name = document.getElementById("contact-name").value
      const email = document.getElementById("contact-email").value
      const message = document.getElementById("contact-message").value

      // In a real app, you would send the form data to your backend
      contactFormContainer.classList.add("hidden")
      contactSuccess.classList.remove("hidden")

      // Reset form
      contactForm.reset()

      // Reset success message after 3 seconds
      setTimeout(() => {
        contactFormContainer.classList.remove("hidden")
        contactSuccess.classList.add("hidden")
      }, 3000)
    })
  }

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href")
      if (targetId === "#") return

      const targetElement = document.querySelector(targetId)
      if (targetElement) {
        targetElement.scrollIntoView({
          behavior: "smooth",
        })
      }
    })
  })

  // Home link click handler
  const homeLink = document.getElementById("home-link")
  if (homeLink) {
    homeLink.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      })
    })
  }

  // Logout functionality
  const logoutBtn = document.getElementById("logout-btn");
if (logoutBtn) {
  logoutBtn.addEventListener("click", () => {
    localStorage.removeItem("isLoggedIn");
    window.location.reload(); // Reload the page to reset the login status
  });
}


  function analyzeEmail(content) {
    const lowerContent = content.toLowerCase()
    let spamScore = 0
    let totalWeight = 0
    const detectedFeatures = []

    // Track category scores
    const categoryScores = {
      Phishing: 0,
      Promotion: 0,
      Scam: 0,
      Malware: 0,
      "Social Engineering": 0,
    }

    // Track total weights per category for normalization
    const categoryWeights = {
      Phishing: 0,
      Promotion: 0,
      Scam: 0,
      Malware: 0,
      "Social Engineering": 0,
    }

    spamIndicators.forEach((indicator) => {
      if (lowerContent.includes(indicator.term)) {
        spamScore += indicator.weight
        totalWeight += indicator.weight

        // Add to category score
        categoryScores[indicator.category] += indicator.weight
        categoryWeights[indicator.category] += indicator.weight

        let severity = "low"
        if (indicator.weight >= 0.7) {
          severity = "high"
        } else if (indicator.weight >= 0.5) {
          severity = "medium"
        }

        detectedFeatures.push({
          term: indicator.term,
          weight: indicator.weight,
          severity: severity,
          category: indicator.category,
        })
      }
    })

    // Check for ALL CAPS sections
    if (content.match(/[A-Z]{5,}/)) {
      spamScore += 0.5
      totalWeight += 0.5

      // Assign to Social Engineering category
      categoryScores["Social Engineering"] += 0.5
      categoryWeights["Social Engineering"] += 0.5

      detectedFeatures.push({
        term: "ALL CAPS text",
        weight: 0.5,
        severity: "medium",
        category: "Social Engineering",
      })
    }

    // Check for multiple exclamation marks
    if (content.match(/!{2,}/)) {
      spamScore += 0.6
      totalWeight += 0.6

      // Assign to Social Engineering category
      categoryScores["Social Engineering"] += 0.6
      categoryWeights["Social Engineering"] += 0.6

      detectedFeatures.push({
        term: "Multiple exclamation marks (!!!)",
        weight: 0.6,
        severity: "medium",
        category: "Social Engineering",
      })
    }

    // Check for suspicious URLs
    if (content.match(/bit\.ly|goo\.gl|tinyurl|ow\.ly/i)) {
      spamScore += 0.8
      totalWeight += 0.8

      // Assign to Phishing category
      categoryScores["Phishing"] += 0.8
      categoryWeights["Phishing"] += 0.8

      detectedFeatures.push({
        term: "Shortened URL links",
        weight: 0.8,
        severity: "high",
        category: "Phishing",
      })
    }

    // Check for email addresses that don't match the sender domain
    if (content.match(/reply to [^@]+@(?!yourcompany\.com)[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/i)) {
      spamScore += 0.7
      totalWeight += 0.7

      // Assign to Phishing category
      categoryScores["Phishing"] += 0.7
      categoryWeights["Phishing"] += 0.7

      detectedFeatures.push({
        term: "Mismatched email domain",
        weight: 0.7,
        severity: "high",
        category: "Phishing",
      })
    }

    const normalizedScore = totalWeight > 0 ? spamScore / totalWeight : 0
    const confidencePercentage = Math.min(Math.round(normalizedScore * 100), 100)

    // Determine the most likely spam category
    let dominantCategory = "None"
    let highestCategoryScore = 0

    for (const category in categoryScores) {
      // Normalize the category score
      const normalizedCategoryScore =
        categoryWeights[category] > 0 ? categoryScores[category] / categoryWeights[category] : 0

      if (normalizedCategoryScore > highestCategoryScore) {
        highestCategoryScore = normalizedCategoryScore
        dominantCategory = category
      }
    }

    if (detectedFeatures.length > 0) {
      const isSpam = confidencePercentage > 50

      // Update result card styling
      if (isSpam) {
        result.className = "card result-card result-spam"
        resultTitle.className = "result-title spam"
        resultTitle.textContent = "Likely Spam"
        progressBar.className = "progress-bar spam"

        // Set the category
        document.getElementById("spam-category").textContent = dominantCategory
        document.getElementById("category-container").classList.remove("hidden")

        // Set category icon
        const categoryIcon = document.getElementById("category-icon")
        switch (dominantCategory) {
          case "Phishing":
            categoryIcon.className = "fas fa-fish"
            break
          case "Promotion":
            categoryIcon.className = "fas fa-tag"
            break
          case "Scam":
            categoryIcon.className = "fas fa-skull-crossbones"
            break
          case "Malware":
            categoryIcon.className = "fas fa-bug"
            break
          case "Social Engineering":
            categoryIcon.className = "fas fa-user-secret"
            break
          default:
            categoryIcon.className = "fas fa-exclamation-triangle"
        }

        // Set category color
        const categoryBadge = document.getElementById("category-badge")
        categoryBadge.className = "category-badge"
        categoryBadge.classList.add(dominantCategory.toLowerCase().replace(" ", "-"))
      } else {
        result.className = "card result-card result-ham"
        resultTitle.className = "result-title ham"
        resultTitle.textContent = "Probably Not Spam"
        progressBar.className = "progress-bar ham"
        document.getElementById("category-container").classList.add("hidden")
      }

      confidence.textContent = `Spam Score: ${confidencePercentage}%`

      // Clear and populate feature list
      featureList.innerHTML = ""

      // Group features by category
      const categorizedFeatures = {}
      detectedFeatures.forEach((feature) => {
        if (!categorizedFeatures[feature.category]) {
          categorizedFeatures[feature.category] = []
        }
        categorizedFeatures[feature.category].push(feature)
      })

      // Sort features by category and then by weight
      for (const category in categorizedFeatures) {
        // Create category header
        const categoryHeader = document.createElement("div")
        categoryHeader.className = "feature-category"

        // Add category icon
        const categoryIcon = document.createElement("i")
        switch (category) {
          case "Phishing":
            categoryIcon.className = "fas fa-fish"
            break
          case "Promotion":
            categoryIcon.className = "fas fa-tag"
            break
          case "Scam":
            categoryIcon.className = "fas fa-skull-crossbones"
            break
          case "Malware":
            categoryIcon.className = "fas fa-bug"
            break
          case "Social Engineering":
            categoryIcon.className = "fas fa-user-secret"
            break
          default:
            categoryIcon.className = "fas fa-exclamation-triangle"
        }

        const categoryTitle = document.createElement("span")
        categoryTitle.textContent = category

        categoryHeader.appendChild(categoryIcon)
        categoryHeader.appendChild(categoryTitle)
        featureList.appendChild(categoryHeader)

        // Sort features by weight
        categorizedFeatures[category].sort((a, b) => b.weight - a.weight)

        // Add features
        categorizedFeatures[category].forEach((feature) => {
          const li = document.createElement("li")
          li.className = "feature-item"

          const indicator = document.createElement("span")
          indicator.className = `feature-indicator ${feature.severity}-indicator`

          const text = document.createElement("span")
          text.textContent = `"${feature.term}" (Impact: ${Math.round(feature.weight * 100)}%)`

          li.appendChild(indicator)
          li.appendChild(text)
          featureList.appendChild(li)
        })
      }
    } else {
      result.className = "card result-card result-ham"
      resultTitle.className = "result-title ham"
      resultTitle.textContent = "No Spam Detected"
      progressBar.className = "progress-bar ham"
      confidence.textContent = "Spam Score: 5%"
      document.getElementById("category-container").classList.add("hidden")

      featureList.innerHTML =
        '<li class="feature-item"><span class="feature-indicator low-indicator"></span>No suspicious features detected</li>'
    }

    result.classList.remove("hidden")

    // Animate progress bar
    setTimeout(() => {
      progressBar.style.width = detectedFeatures.length > 0 ? `${confidencePercentage}%` : "5%"
    }, 100)
    

    // Scroll to result
    setTimeout(() => {
      result.scrollIntoView({ behavior: "smooth", block: "nearest" })
    }, 200)
  }
})