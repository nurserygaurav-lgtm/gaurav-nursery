import Spinner from './Spinner.jsx';

export default function PageLoader({ label = 'Loading page' }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center text-leaf-700">
      <Spinner label={label} />
    </div>
  );
}
