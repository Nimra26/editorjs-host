function formatDoc(cmd, value=null) {
	if(value) {
		document.execCommand(cmd, false, value);
	} else {
		document.execCommand(cmd);
	}
}

function addLink() {
	const url = prompt('Insert url');
	formatDoc('createLink', url);
}




const content = document.getElementById('content');

content.addEventListener('mouseenter', function () {
	const a = content.querySelectorAll('a');
	a.forEach(item=> {
		item.addEventListener('mouseenter', function () {
			content.setAttribute('contenteditable', false);
			item.target = '_blank';
		})
		item.addEventListener('mouseleave', function () {
			content.setAttribute('contenteditable', true);
		})
	})
})


const showCode = document.getElementById('show-code');
let active = false;

showCode.addEventListener('click', function () {
	showCode.dataset.active = !active;
	active = !active
	if(active) {
		content.textContent = content.innerHTML;
		content.setAttribute('contenteditable', false);
	} else {
		content.innerHTML = content.textContent;
		content.setAttribute('contenteditable', true);
	}
})



const filename = document.getElementById('filename');

function fileHandle(value) {
	if(value === 'new') {
		content.innerHTML = '';
		filename.value = 'untitled';
	} else if(value === 'txt') {
		const blob = new Blob([content.innerText])
		const url = URL.createObjectURL(blob)
		const link = document.createElement('a');
		link.href = url;
		link.download = `${filename.value}.txt`;
		link.click();
	} else if(value === 'pdf') {
		html2pdf(content).save(filename.value);
	}
}


function insertTable() {
    // const rows = parseInt(prompt('Enter number of rows'));
    // const cols = parseInt(prompt('Enter number of columns'));
    
    if (!rows || !cols || rows <= 0 || cols <= 0) {
        alert('Please enter valid numbers');
        return;
    }
    
    const selection = window.getSelection();
    const range = selection.getRangeAt(0);
    
    // Create table with proper styling
    const table = document.createElement('table');
    table.style.borderCollapse = 'collapse';
    table.style.width = '100%';
    table.style.margin = '10px 0';
    
    // Create rows and cells
    for (let i = 0; i < rows; i++) {
        const row = document.createElement('tr');
        
        for (let j = 0; j < cols; j++) {
            const cell = document.createElement('td');
            cell.innerHTML = '&nbsp;';
            cell.style.padding = '8px';
            cell.style.border = '1px solid #ddd';
            cell.style.minWidth = '50px';
            row.appendChild(cell);
        }
        
        table.appendChild(row);
    }
    
    // Handle contenteditable container properly
    const container = document.getElementById('content');
    if (range.startContainer.parentNode === container) {
        // If cursor is directly in container, create paragraph first
        const p = document.createElement('p');
        p.appendChild(table);
        range.insertNode(p);
    } else {
        // If cursor is in another element, insert table directly
        range.insertNode(table);
    }
    
    // Set focus to first cell
    const firstCell = table.rows[0].cells[0];
    const newRange = document.createRange();
    newRange.selectNodeContents(firstCell);
    selection.removeAllRanges();
    selection.addRange(newRange);
    firstCell.focus();
}

// Add this event listener to your existing code
document.addEventListener('click', function(e) {
    if (e.target.id === 'insert-table') {
        const rows = parseInt(3);
        const cols = parseInt(3);
        insertTable(rows, cols);
    }
});