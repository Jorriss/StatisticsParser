// Import CSS
// import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/styles.scss'

// Import all of Bootstrap's JS
import * as bootstrap from 'bootstrap'
import 'datatables.net';
import 'datatables.net-bs5';

import { initalizeDocument } from './initialize.js';

// Initialize on document ready using native JavaScript
document.addEventListener('DOMContentLoaded', async function() {
    await initalizeDocument();
});

export { initalizeDocument };
