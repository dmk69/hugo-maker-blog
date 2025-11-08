/**
 * 主JavaScript文件 - 技术探索者网站
 * 实现代码复制功能和其他交互效果
 */

// 等待DOM加载完成
document.addEventListener('DOMContentLoaded', function() {
  // 初始化所有功能
  initCodeCopy();
  initCodeGroups();
  initScrollToTop();
  initThemeToggle();
  initSearch();
  initAnimations();
  initTooltips();
  initModals();
  initNotifications();
});

/**
 * 代码复制功能
 */
function initCodeCopy() {
  // 查找所有代码块
  const codeBlocks = document.querySelectorAll('pre code');
  
  codeBlocks.forEach(function(codeBlock) {
    // 创建代码容器
    const container = document.createElement('div');
    container.className = 'code-container';
    
    // 创建代码头部
    const header = document.createElement('div');
    header.className = 'code-header';
    
    // 获取语言类型
    const language = getLanguageClass(codeBlock);
    const languageSpan = document.createElement('span');
    languageSpan.className = 'code-language';
    languageSpan.textContent = language || 'text';
    
    // 创建操作按钮容器
    const actions = document.createElement('div');
    actions.className = 'code-actions';
    
    // 创建复制按钮
    const copyButton = document.createElement('button');
    copyButton.className = 'copy-button';
    copyButton.setAttribute('aria-label', '复制代码');
    copyButton.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
    
    // 添加复制功能
    copyButton.addEventListener('click', function() {
      copyCode(codeBlock, copyButton);
    });
    
    // 组装元素
    actions.appendChild(copyButton);
    header.appendChild(languageSpan);
    header.appendChild(actions);
    
    // 包装代码块
    const pre = codeBlock.parentNode;
    const codeWrapper = document.createElement('div');
    codeWrapper.className = 'code-block';
    
    // 将元素插入DOM
    pre.parentNode.insertBefore(container, pre);
    container.appendChild(header);
    container.appendChild(codeWrapper);
    codeWrapper.appendChild(pre);
  });
}

/**
 * 获取代码语言类型
 */
function getLanguageClass(codeBlock) {
  const classes = codeBlock.className.split(' ');
  for (const cls of classes) {
    if (cls.startsWith('language-')) {
      return cls.replace('language-', '');
    }
  }
  return null;
}

/**
 * 复制代码到剪贴板
 */
function copyCode(codeBlock, button) {
  const text = codeBlock.textContent || codeBlock.innerText;
  
  // 使用现代剪贴板API
  if (navigator.clipboard && navigator.clipboard.writeText) {
    navigator.clipboard.writeText(text).then(function() {
      showCopySuccess(button);
    }).catch(function(err) {
      fallbackCopyTextToClipboard(text, button);
    });
  } else {
    // 回退到传统方法
    fallbackCopyTextToClipboard(text, button);
  }
}

/**
 * 回退的复制方法
 */
function fallbackCopyTextToClipboard(text, button) {
  const textArea = document.createElement('textarea');
  textArea.value = text;
  textArea.style.position = 'fixed';
  textArea.style.left = '-999999px';
  textArea.style.top = '-999999px';
  document.body.appendChild(textArea);
  textArea.focus();
  textArea.select();
  
  try {
    document.execCommand('copy');
    showCopySuccess(button);
  } catch (err) {
    console.error('复制失败:', err);
    showNotification('复制失败，请手动复制', 'error');
  }
  
  document.body.removeChild(textArea);
}

/**
 * 显示复制成功状态
 */
function showCopySuccess(button) {
  button.classList.add('copied');
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
  `;
  
  showNotification('代码已复制到剪贴板', 'success');
  
  // 2秒后恢复原始状态
  setTimeout(function() {
    button.classList.remove('copied');
    button.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
      </svg>
    `;
  }, 2000);
}

/**
 * 代码组功能
 */
function initCodeGroups() {
  const codeGroups = document.querySelectorAll('.code-group');
  
  codeGroups.forEach(function(group) {
    const tabs = group.querySelectorAll('.code-group-tab');
    const contents = group.querySelectorAll('.code-group-content');
    
    tabs.forEach(function(tab, index) {
      tab.addEventListener('click', function() {
        // 移除所有活动状态
        tabs.forEach(function(t) t.classList.remove('active'));
        contents.forEach(function(c) c.classList.remove('active'));
        
        // 添加当前活动状态
        tab.classList.add('active');
        if (contents[index]) {
          contents[index].classList.add('active');
        }
      });
    });
  });
}

/**
 * 滚动到顶部功能
 */
function initScrollToTop() {
  // 创建滚动到顶部按钮
  const scrollButton = document.createElement('button');
  scrollButton.className = 'scroll-to-top';
  scrollButton.setAttribute('aria-label', '滚动到顶部');
  scrollButton.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <polyline points="18 15 12 9 6 15"></polyline>
    </svg>
  `;
  
  document.body.appendChild(scrollButton);
  
  // 滚动事件监听
  window.addEventListener('scroll', function() {
    if (window.pageYOffset > 300) {
      scrollButton.classList.add('visible');
    } else {
      scrollButton.classList.remove('visible');
    }
  });
  
  // 点击事件
  scrollButton.addEventListener('click', function() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/**
 * 主题切换功能
 */
function initThemeToggle() {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  // 检查本地存储的主题设置
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeToggle(savedTheme);
  }
  
  // 点击事件
  themeToggle.addEventListener('click', function() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeToggle(newTheme);
  });
}

/**
 * 更新主题切换按钮状态
 */
function updateThemeToggle(theme) {
  const themeToggle = document.querySelector('.theme-toggle');
  if (!themeToggle) return;
  
  if (theme === 'dark') {
    themeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <circle cx="12" cy="12" r="5"></circle>
        <line x1="12" y1="1" x2="12" y2="3"></line>
        <line x1="12" y1="21" x2="12" y2="23"></line>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
        <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
        <line x1="1" y1="12" x2="3" y2="12"></line>
        <line x1="21" y1="12" x2="23" y2="12"></line>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
        <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
      </svg>
    `;
  } else {
    themeToggle.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
      </svg>
    `;
  }
}

/**
 * 搜索功能
 */
function initSearch() {
  const searchInput = document.querySelector('.search-input, .posts-search-input, .projects-search-input');
  if (!searchInput) return;
  
  let searchTimeout;
  
  searchInput.addEventListener('input', function() {
    clearTimeout(searchTimeout);
    const query = this.value.trim();
    
    searchTimeout = setTimeout(function() {
      performSearch(query);
    }, 300);
  });
}

/**
 * 执行搜索
 */
function performSearch(query) {
  // 这里可以实现实际的搜索逻辑
  // 例如：发送AJAX请求到搜索API或过滤当前页面内容
  console.log('搜索查询:', query);
}

/**
 * 初始化动画效果
 */
function initAnimations() {
  // 检查用户是否偏好减少动画
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) return;
  
  // 添加滚动动画观察器
  const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver(function(entries) {
    entries.forEach(function(entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add('animate-in');
      }
    });
  }, observerOptions);
  
  // 观察需要动画的元素
  const animatedElements = document.querySelectorAll('.fade-in, .slide-up, .slide-in-left, .slide-in-right');
  animatedElements.forEach(function(element) {
    observer.observe(element);
  });
}

/**
 * 工具提示功能
 */
function initTooltips() {
  const tooltips = document.querySelectorAll('[data-tooltip]');
  
  tooltips.forEach(function(tooltip) {
    tooltip.addEventListener('mouseenter', function() {
      showTooltip(this);
    });
    
    tooltip.addEventListener('mouseleave', function() {
      hideTooltip(this);
    });
    
    // 触摸设备支持
    tooltip.addEventListener('touchstart', function(e) {
      e.preventDefault();
      showTooltip(this);
    });
    
    tooltip.addEventListener('touchend', function(e) {
      e.preventDefault();
      hideTooltip(this);
    });
  });
}

/**
 * 显示工具提示
 */
function showTooltip(element) {
  const text = element.getAttribute('data-tooltip');
  if (!text) return;
  
  const tooltip = document.createElement('div');
  tooltip.className = 'tooltip-popup';
  tooltip.textContent = text;
  
  document.body.appendChild(tooltip);
  
  // 定位工具提示
  const rect = element.getBoundingClientRect();
  tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
  tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
  
  // 添加显示动画
  setTimeout(function() {
    tooltip.classList.add('visible');
  }, 10);
  
  element._tooltip = tooltip;
}

/**
 * 隐藏工具提示
 */
function hideTooltip(element) {
  if (element._tooltip) {
    element._tooltip.classList.remove('visible');
    setTimeout(function() {
      if (element._tooltip && element._tooltip.parentNode) {
        element._tooltip.parentNode.removeChild(element._tooltip);
      }
      element._tooltip = null;
    }, 200);
  }
}

/**
 * 模态框功能
 */
function initModals() {
  const modalTriggers = document.querySelectorAll('[data-modal-target]');
  const modalCloses = document.querySelectorAll('[data-modal-close]');
  
  // 打开模态框
  modalTriggers.forEach(function(trigger) {
    trigger.addEventListener('click', function(e) {
      e.preventDefault();
      const targetId = this.getAttribute('data-modal-target');
      const modal = document.getElementById(targetId);
      if (modal) {
        openModal(modal);
      }
    });
  });
  
  // 关闭模态框
  modalCloses.forEach(function(close) {
    close.addEventListener('click', function(e) {
      e.preventDefault();
      const modal = this.closest('.modal');
      if (modal) {
        closeModal(modal);
      }
    });
  });
  
  // 点击背景关闭模态框
  document.addEventListener('click', function(e) {
    if (e.target.classList.contains('modal')) {
      closeModal(e.target);
    }
  });
  
  // ESC键关闭模态框
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      const openModal = document.querySelector('.modal.show');
      if (openModal) {
        closeModal(openModal);
      }
    }
  });
}

/**
 * 打开模态框
 */
function openModal(modal) {
  modal.classList.add('show');
  document.body.style.overflow = 'hidden';
  
  // 焦点管理
  const focusableElements = modal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
  if (focusableElements.length > 0) {
    focusableElements[0].focus();
  }
}

/**
 * 关闭模态框
 */
function closeModal(modal) {
  modal.classList.remove('show');
  document.body.style.overflow = '';
}

/**
 * 通知功能
 */
function initNotifications() {
  // 创建通知容器
  const container = document.createElement('div');
  container.className = 'notifications-container';
  container.setAttribute('aria-live', 'polite');
  document.body.appendChild(container);
}

/**
 * 显示通知
 */
function showNotification(message, type = 'info', duration = 5000) {
  const container = document.querySelector('.notifications-container');
  if (!container) return;
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  notification.textContent = message;
  
  container.appendChild(notification);
  
  // 显示动画
  setTimeout(function() {
    notification.classList.add('show');
  }, 10);
  
  // 自动隐藏
  setTimeout(function() {
    hideNotification(notification);
  }, duration);
  
  // 点击关闭
  notification.addEventListener('click', function() {
    hideNotification(notification);
  });
}

/**
 * 隐藏通知
 */
function hideNotification(notification) {
  notification.classList.remove('show');
  
  setTimeout(function() {
    if (notification.parentNode) {
      notification.parentNode.removeChild(notification);
    }
  }, 300);
}

/**
 * 表单验证
 */
function validateForm(form) {
  const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
  let isValid = true;
  
  inputs.forEach(function(input) {
    if (!input.value.trim()) {
      showError(input, '此字段为必填项');
      isValid = false;
    } else {
      clearError(input);
    }
  });
  
  return isValid;
}

/**
 * 显示表单错误
 */
function showError(input, message) {
  clearError(input);
  
  input.classList.add('error');
  
  const error = document.createElement('div');
  error.className = 'error-message';
  error.textContent = message;
  
  input.parentNode.appendChild(error);
}

/**
 * 清除表单错误
 */
function clearError(input) {
  input.classList.remove('error');
  
  const error = input.parentNode.querySelector('.error-message');
  if (error) {
    error.parentNode.removeChild(error);
  }
}

/**
 * 防抖函数
 */
function debounce(func, wait) {
  let timeout;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function() {
      func.apply(context, args);
    }, wait);
  };
}

/**
 * 节流函数
 */
function throttle(func, limit) {
  let inThrottle;
  return function() {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(function() {
        inThrottle = false;
      }, limit);
    }
  };
}

// 导出主要函数供全局使用
window.TechBlog = {
  showNotification: showNotification,
  validateForm: validateForm,
  debounce: debounce,
  throttle: throttle
};