
import { LogIn } from 'lucide-react'
import '../styles/unauthorized.css'
import { useLocation } from 'react-router-dom'

export default function Unauthorized() {
  const location = useLocation();
  const pathname = location.pathname;
 if (pathname === '/unauthorized') {
     setTimeout(() => {
        window.location.href = '/';
        }, 2000); // Redirect after 5 seconds
  }

  return (
    <div>
      <div className="container">
    <div className="error-container">
        <h1 className="display-1">Oops!</h1>
        <h2 className="display-4">404 Not Found</h2>
        <div className="error-details mb-4">
            Sorry, an error has occurred. The requested page was not found!
        </div>
        <div className="error-actions d-flex flex-wrap gap-2 justify-content-center">
            <a href="/" className="btn btn-primary btn-lg" style={{width:'240px'}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                    className="bi bi-house me-2" viewBox="0 0 16 16">
                    <path
                        d="M8.707 1.5a1 1 0 0 0-1.414 0L.646 8.146a.5.5 0 0 0 .708.708L2 8.207V13.5A1.5 1.5 0 0 0 3.5 15h9a1.5 1.5 0 0 0 1.5-1.5V8.207l.646.647a.5.5 0 0 0 .708-.708L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.707 1.5ZM13 7.207V13.5a.5.5 0 0 1-.5.5h-9a.5.5 0 0 1-.5-.5V7.207l5-5 5 5Z" />
                </svg>
                Take Me Home
            </a>
            <a href="/Login" className="btn btn-outline-secondary btn-lg bg-amber-600" style={{width:'240px'}}>
               <LogIn className="me-2" />
                Login
            </a>
        </div>
    </div>
</div>
    </div>
  )
}
