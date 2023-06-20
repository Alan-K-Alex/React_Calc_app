import logo from './logo.svg';
import "../src/style.css";
import { useReducer } from "react"
import DigitButton from './DigitButton';
import OperationButton from './OperationButton';


export const ACTIONS = {

ADD_DIGIT : "add-digit",
CHOOSE_OPERATION : "choose-operation",
CLEAR: "clear",
DELETE_DIGIT:"delete-digit",
EVALUATE:"evaluate"

}

function reducer(state,{ type , payload })
{

switch(type)
{

  case ACTIONS.ADD_DIGIT :{

    if(state.overwrite)
    {

      return{
        ...state,

        currentOperand:payload.digit,
        overwrite:false
      }
    }

    if(state.currentOperand === "0" && payload.digit === "0")
    {
      return state
    }

    if(payload.digit === "." && !state.currentOperand)
    {
      return{

        ...state,

        currentOperand:`0${payload.digit}`
      }
    }

    if( payload.digit === "." &&state.currentOperand.includes(".") ) {return state}

    
    return {

      ...state,
      currentOperand : `${state.currentOperand || ""}${payload.digit}`
      

    };

  }

  case ACTIONS.DELETE_DIGIT:
    {
        if(state.overwrite)
        {
          return {
            ...state,
            overwrite:false,
            currentOperand:null
          }
        }

        if(state.currentOperand==null)
        {
          return state
        }

        if(state.currentOperand.length == 1)
        {
          return{

            ...state,
            currentOperand:null,
          }
        }

        return{

          ...state,
          currentOperand:state.currentOperand.slice(0,-1)
        }




    }

  case ACTIONS.CLEAR : 

    return {}
  
    case ACTIONS.CHOOSE_OPERATION :
      {
       
        if(state.currentOperand == null && state.previousOperand==null)
        {
          return state
        }



        else if(state.previousOperand == null)
        {
          return {
            ...state,
            operation:payload.operation,
            previousOperand:state.currentOperand,
            currentOperand: null

          }
        }

        if(state.currentOperand===null)
        {

          return{

            ...state,
            operation:payload.operation
          }

        }

        

        return {

          ...state,
          previousOperand:evaluate(state),
          operation:payload.operation,
          currentOperand:null
          
        }

       

      
         
      }

      case ACTIONS.EVALUATE :
        {
          if(state.operation==null||state.previousOperand==null||state.currentOperand==null)
          {
            return ""
          }

          return {

              ...state,

              overwrite:true,
              previousOperand:null,
              operation:null,
              currentOperand:evaluate(state)

          }
        }


}


}
 

function evaluate({currentOperand,previousOperand,operation})
{

  const n1 = parseFloat(previousOperand);
  const n2 = parseFloat(currentOperand);

  

  if(isNaN(n1)|| isNaN(n2))
  {
    return "23"
  }

  let comp=0;

  switch(operation)
  {

  case "+":

  comp = n1+n2
  break

  case "-":

  comp = n1-n2
  break
  
  case "*":

  comp = n1*n2
  break
  
  case "÷":

  comp = n1/n2
  break
  



  }



  return comp.toString()
  

}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us",{
  maximumFractionDigits:0,
})

function formatOperand(operand)
{
 
if(operand==null) return
const [int,dec]=operand.split(".")

if(dec==null){return INTEGER_FORMATTER.format(int)}

return `${INTEGER_FORMATTER.format(int)}.${dec}`

}


function App() {


const [{currentOperand,previousOperand,operation},dispatch] = useReducer(reducer,{})

  return (
   <div className="calculator-grid">
    <div className="output">
      <div className="previous-operand">{formatOperand(previousOperand)}{operation}</div>
      <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
     <button className='span-two' onClick={()=>{dispatch({type:ACTIONS.CLEAR})}}>AC</button>
    <button onClick={()=>{dispatch({type:ACTIONS.DELETE_DIGIT})}}>DEL</button>
   
    <OperationButton operation="÷" dispatch={dispatch}/>
    <DigitButton digit="1" dispatch={dispatch}/>
    <DigitButton digit="2" dispatch={dispatch}/>
    <DigitButton digit="3" dispatch={dispatch}/>
    
    
    
    
    <OperationButton operation="*" dispatch={dispatch}/>
    
    <DigitButton digit="4" dispatch={dispatch}/>
    <DigitButton digit="5" dispatch={dispatch}/>
    <DigitButton digit="6" dispatch={dispatch}/>
    
    <OperationButton operation="+" dispatch={dispatch}/>

    <DigitButton digit="7" dispatch={dispatch}/>
    <DigitButton digit="8" dispatch={dispatch}/>
    <DigitButton digit="9" dispatch={dispatch}/>
    
  
    <OperationButton operation="-" dispatch={dispatch}/>

  
    <DigitButton digit="0" dispatch={dispatch}/>
    <DigitButton digit="." dispatch={dispatch}/>
    <button onClick={()=>{dispatch({type:ACTIONS.EVALUATE})}} className="span-two">=</button>
    





   </div>


  );
}

export default App;
