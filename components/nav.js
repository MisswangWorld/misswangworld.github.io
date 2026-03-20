(function () {
  // Detect which page is active based on the current filename
  const path = window.location.pathname.split('/').pop() || 'index.html';

  const isActive = {
    experiences: path === 'experiences.html',
    projects: path === 'projects.html' || path === 'project-single.html',
  };

  const nav = `
    <nav class="nav">
      <a href="index.html" class="nav-logo">Janis Wang</a>
      <div class="nav-toggle" onclick="toggleMenu()">
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div class="nav-links">
        <a href="experiences.html" class="nav-link${isActive.experiences ? ' active' : ''}">Experiences</a>
        <a href="projects.html" class="nav-link${isActive.projects ? ' active' : ''}">Projects</a>
        <a href="index.html#contact" class="nav-link btn">Contact</a>
      </div>
    </nav>
  `;

  const placeholder = document.getElementById('nav-placeholder');
  if (placeholder) {
    placeholder.outerHTML = nav;
  }

  // Mobile menu toggle — exposed globally so onclick="toggleMenu()" works
  window.toggleMenu = function () {
    document.querySelector('.nav-links').classList.toggle('active');
  };

  // Close mobile menu when any nav link is clicked
  document.addEventListener('click', function (e) {
    if (e.target.closest('.nav-link')) {
      document.querySelector('.nav-links')?.classList.remove('active');
    }
  });
})();
