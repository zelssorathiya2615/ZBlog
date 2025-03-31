document.addEventListener('DOMContentLoaded', function () {
    const blogList = document.getElementById('blog-list');
    const searchTitle = document.getElementById('search-title');
    const searchContent = document.getElementById('search-content');
    const searchDate = document.getElementById('search-date');

    let posts = [];

    function renderPosts(filteredPosts) {
        blogList.innerHTML = '';
        filteredPosts.forEach(post => {
            const blogItem = document.createElement('div');
            blogItem.classList.add('blog-post');
            blogItem.innerHTML = `
                <h3>${post.title}</h3>
                <p class="post-date">${formatDate(post.date)}</p>
                <p>${post.content}</p>
            `;
            blogList.appendChild(blogItem);
        });
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        if (isNaN(date)) return 'Invalid date';
    
        const month = date.toLocaleString('en-US', { month: 'short' }); // Mar
        const day = date.getUTCDate();
        const ordinalSuffix = (n) => {
            if (n > 3 && n < 21) return 'th';
            switch (n % 10) {
                case 1: return 'st';
                case 2: return 'nd';
                case 3: return 'rd';
                default: return 'th';
            }
        };
        const dayWithSuffix = `${day}${ordinalSuffix(day)}`; // 31st
        const year = date.getUTCFullYear();
        const hours = date.getUTCHours() % 12 || 12;
        const minutes = date.getUTCMinutes().toString().padStart(2, '0');
        const ampm = date.getUTCHours() >= 12 ? 'PM' : 'AM';
    
        return `${month}. ${dayWithSuffix}, ${year} at ${hours}:${minutes} ${ampm}`;
    }
    
    function filterPosts() {
        let filteredPosts = posts;
        const title = searchTitle.value.toLowerCase();
        const content = searchContent.value.toLowerCase();
        const dateValue = searchDate.value;

        if (title) {
            filteredPosts = filteredPosts.filter(post => post.title.toLowerCase().includes(title));
        }
        if (content) {
            filteredPosts = filteredPosts.filter(post => post.content.toLowerCase().includes(content));
        }
        if (dateValue) {
            // Filter by matching date (ignoring time)
            filteredPosts = filteredPosts.filter(post => {
                const postDate = new Date(post.date).toISOString().split('T')[0];
                return postDate === dateValue;
            });
        }

        renderPosts(filteredPosts);
    }

    searchTitle.addEventListener('input', filterPosts);
    searchContent.addEventListener('input', filterPosts);
    searchDate.addEventListener('change', filterPosts);

    fetch('blogs/posts.json')
        .then(response => response.json())
        .then(data => {
            posts = data.posts.sort((a, b) => new Date(b.date) - new Date(a.date));
            renderPosts(posts);
        })
        .catch(error => console.error('Error loading blog posts:', error));
});
