// Простий тестовий JavaScript
console.log('Gulp JS compilation works!');

document.addEventListener('DOMContentLoaded', function() {
    const button = document.getElementById('test-btn');
    const output = document.getElementById('output');
    
    if (button && output) {
        button.addEventListener('click', function() {
            output.innerHTML = `
                <div style="background: #d4edda; color: #155724; padding: 1rem; border-radius: 5px; margin: 1rem 0;">
                    <strong>✅ Успіх!</strong> Gulp автоматизація працює коректно!
                    <br>SCSS → CSS ✓ | JS → min.js ✓ | BrowserSync ✓
                </div>
            `;
            
            button.textContent = 'Працює! 🎉';
            button.style.background = '#4d3ce7ff';
            
            setTimeout(() => {
                button.textContent = 'Тестувати Gulp';
                button.style.background = '';
            }, 2000);
        });
    }
});