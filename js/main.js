// 滚动时导航栏效果
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// 在线客服系统
class CustomerService {
    constructor() {
        this.initChat();
        this.messages = [];
        this.isOpen = false;
    }

    initChat() {
        // 创建聊天按钮
        const chatButton = document.createElement('button');
        chatButton.classList.add('chat-button');
        chatButton.innerHTML = '<i class="fas fa-comments"></i>';
        document.body.appendChild(chatButton);

        // 创建聊天窗口
        const chatWidget = document.createElement('div');
        chatWidget.classList.add('chat-widget');
        chatWidget.innerHTML = `
            <div class="chat-header">
                <h3>在线客服</h3>
                <button class="chat-close">&times;</button>
            </div>
            <div class="chat-messages"></div>
            <div class="chat-input">
                <input type="text" placeholder="请输入您的问题...">
                <button>发送</button>
            </div>
        `;
        document.body.appendChild(chatWidget);

        // 绑定事件
        chatButton.addEventListener('click', () => this.toggleChat());
        chatWidget.querySelector('.chat-close').addEventListener('click', () => this.toggleChat());
        
        const input = chatWidget.querySelector('input');
        const sendButton = chatWidget.querySelector('.chat-input button');

        const sendMessage = () => {
            const message = input.value.trim();
            if (message) {
                this.addMessage(message, 'user');
                input.value = '';
                this.handleUserMessage(message);
            }
        };

        sendButton.addEventListener('click', sendMessage);
        input.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                sendMessage();
            }
        });

        this.chatWidget = chatWidget;
        this.chatMessages = chatWidget.querySelector('.chat-messages');

        // 添加欢迎消息
        setTimeout(() => {
            this.addMessage('您好！欢迎咨询梓钰再生资源回收，请问有什么可以帮您？', 'agent');
        }, 500);
    }

    toggleChat() {
        this.isOpen = !this.isOpen;
        this.chatWidget.classList.toggle('active');
        if (this.isOpen) {
            this.chatWidget.querySelector('input').focus();
        }
    }

    addMessage(text, type) {
        const message = document.createElement('div');
        message.classList.add('message', type);
        message.textContent = text;
        this.chatMessages.appendChild(message);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
        this.messages.push({ text, type });
    }

    handleUserMessage(message) {
        // 简单的自动回复逻辑
        setTimeout(() => {
            let reply = this.getAutoReply(message);
            this.addMessage(reply, 'agent');
        }, 1000);
    }

    getAutoReply(message) {
        // 简单的关键词匹配
        const keywords = {
            '价格': '我们的价格根据市场实时变动，建议您提供具体物品，我们可以为您做详细评估。',
            '上门': '是的，我们提供免费上门服务。请提供您的地址和联系方式，我们会安排专业人员上门。',
            '电话': '您可以拨打我们的24小时服务热线：400-XXX-XXXX',
            '地址': '我们的公司地址是：XX省XX市XX区XX路XX号',
            '资质': '我们公司持有完整的经营资质，是合法合规的再生资源回收企业。'
        };

        for (let key in keywords) {
            if (message.includes(key)) {
                return keywords[key];
            }
        }

        return '感谢您的咨询，请问您想了解具体哪些方面的信息？我们提供贵金属回收、有色金属回收等服务。';
    }
}

// 初始化客服系统
new CustomerService();

// 添加价格查询功能
class MetalPriceTracker {
    constructor() {
        this.modal = document.getElementById('priceModal');
        this.priceList = document.getElementById('priceList');
        this.initEventListeners();
    }

    initEventListeners() {
        const priceButtons = document.querySelectorAll('.price-check');
        const closeBtn = document.querySelector('.close');

        priceButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.showPrices(e.target.dataset.type);
            });
        });

        closeBtn.addEventListener('click', () => {
            this.modal.style.display = 'none';
        });

        window.addEventListener('click', (e) => {
            if (e.target === this.modal) {
                this.modal.style.display = 'none';
            }
        });
    }

    async showPrices(metalType) {
        this.modal.style.display = 'block';
        this.priceList.innerHTML = '<p>加载中...</p>';

        try {
            // 这里可以替换为实际的API调用
            const prices = await this.fetchMetalPrices(metalType);
            this.displayPrices(prices);
        } catch (error) {
            this.priceList.innerHTML = '<p>价格获取失败，请稍后再试</p>';
        }
    }

    async fetchMetalPrices(metalType) {
        // 模拟API调用
        return new Promise(resolve => {
            setTimeout(() => {
                const mockPrices = {
                    precious: {
                        '黄金': '￥388/克',
                        '白银': '￥4.5/克',
                        '铂金': '￥230/克'
                    },
                    'non-ferrous': {
                        '铜': '￥58/千克',
                        '铝': '￥15/千克',
                        '镍': '￥150/千克'
                    }
                };
                resolve(mockPrices[metalType]);
            }, 1000);
        });
    }

    displayPrices(prices) {
        let html = '<table class="price-table">';
        html += '<tr><th>金属类型</th><th>当前价格</th></tr>';
        
        for (const [metal, price] of Object.entries(prices)) {
            html += `<tr><td>${metal}</td><td>${price}</td></tr>`;
        }
        
        html += '</table>';
        this.priceList.innerHTML = html;
    }
}

// 初始化价格查询功能
new MetalPriceTracker();

// 添加表单处理
class InquiryForm {
    constructor() {
        this.form = document.getElementById('inquiryForm');
        this.initForm();
    }

    initForm() {
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleSubmit();
        });
    }

    async handleSubmit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());

        try {
            // 这里可以替换为实际的API调用
            await this.submitInquiry(data);
            alert('提交成功！我们会尽快与您联系。');
            this.form.reset();
        } catch (error) {
            alert('提交失败，请稍后重试或直接联系我们。');
        }
    }

    async submitInquiry(data) {
        // 模拟API提交
        return new Promise((resolve) => {
            setTimeout(() => {
                console.log('提交的数据：', data);
                resolve({ success: true });
            }, 1000);
        });
    }
}

// 初始化表单处理
new InquiryForm();

// 添加移动端菜单控制
class MobileMenu {
    constructor() {
        this.menuBtn = document.querySelector('.mobile-menu-btn');
        this.navLinks = document.querySelector('.nav-links');
        this.initMenu();
    }

    initMenu() {
        this.menuBtn.addEventListener('click', () => {
            this.menuBtn.classList.toggle('active');
            this.navLinks.classList.toggle('active');
        });

        // 点击导航链接时关闭菜单
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                this.menuBtn.classList.remove('active');
                this.navLinks.classList.remove('active');
            });
        });
    }
}

// 更新轮播图类
class HeroSlider {
    constructor() {
        this.slider = document.querySelector('.hero-slider');
        this.slides = document.querySelectorAll('.slide');
        this.dots = document.querySelector('.slide-dots');
        this.prevBtn = document.querySelector('.prev-slide');
        this.nextBtn = document.querySelector('.next-slide');
        this.currentSlide = 0;
        this.slideInterval = null;
        this.isTransitioning = false;
        
        this.initSlider();
    }

    initSlider() {
        // 创建轮播点
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                if (!this.isTransitioning) {
                    this.goToSlide(index);
                }
            });
            this.dots.appendChild(dot);
        });

        // 添加按钮事件
        this.prevBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.prevSlide();
            }
        });
        
        this.nextBtn.addEventListener('click', () => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        });

        // 开始自动轮播
        this.startAutoSlide();

        // 添加鼠标悬停事件
        this.slider.addEventListener('mouseenter', () => {
            clearInterval(this.slideInterval);
        });

        this.slider.addEventListener('mouseleave', () => {
            this.startAutoSlide();
        });
    }

    goToSlide(index) {
        if (this.currentSlide === index) return;
        
        this.isTransitioning = true;
        
        // 移除当前活动状态
        this.slides[this.currentSlide].classList.remove('active');
        this.dots.children[this.currentSlide].classList.remove('active');
        
        // 设置新的当前索引
        this.currentSlide = index;
        
        // 添加新的活动状态
        this.slides[this.currentSlide].classList.add('active');
        this.dots.children[this.currentSlide].classList.add('active');
        
        // 过渡结束后重置状态
        setTimeout(() => {
            this.isTransitioning = false;
        }, 1000);
    }

    prevSlide() {
        const index = this.currentSlide === 0 ? this.slides.length - 1 : this.currentSlide - 1;
        this.goToSlide(index);
    }

    nextSlide() {
        const index = this.currentSlide === this.slides.length - 1 ? 0 : this.currentSlide + 1;
        this.goToSlide(index);
    }

    startAutoSlide() {
        if (this.slideInterval) {
            clearInterval(this.slideInterval);
        }
        this.slideInterval = setInterval(() => {
            if (!this.isTransitioning) {
                this.nextSlide();
            }
        }, 5000);
    }
}

// 确保 DOM 加载完成后再初始化轮播图
document.addEventListener('DOMContentLoaded', () => {
    new HeroSlider();
});

// 初始化移动端菜单和轮播
new MobileMenu();

// 添加平滑滚动功能
class ScrollManager {
    constructor() {
        this.initScrollEvents();
    }

    initScrollEvents() {
        // 获取所有导航链接
        const navLinks = document.querySelectorAll('.nav-links a');
        
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                const href = link.getAttribute('href');
                
                // 如果是首页链接，滚动到顶部
                if (href === '#home') {
                    e.preventDefault();
                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth'
                    });
                }
                // 其他链接的平滑滚动
                else if (href.startsWith('#')) {
                    e.preventDefault();
                    const targetElement = document.querySelector(href);
                    if (targetElement) {
                        const navbarHeight = document.querySelector('.navbar').offsetHeight;
                        const targetPosition = targetElement.offsetTop - navbarHeight;
                        
                        window.scrollTo({
                            top: targetPosition,
                            behavior: 'smooth'
                        });
                    }
                }
            });
        });
    }
}

// 初始化滚动管理器
document.addEventListener('DOMContentLoaded', () => {
    new ScrollManager();
    // ... 其他初始化代码
}); 