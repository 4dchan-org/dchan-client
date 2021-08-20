export default function LowScoreDisclaimer({onClick} : {onClick: () => void}) {  
    return (<button onClick={onClick} className="absolute text-2xl text-gray-800 top-0 left-0 right-0 bottom-0">
        <div>⚠️</div>
        <div>Post hidden due to reports.</div>
        <div className="text-sm text-gray-600">Click to show anyway.</div>
    </button>)
}