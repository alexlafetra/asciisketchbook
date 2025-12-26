function AsciiButton({title,state,onClick}){
    return(
        <div className = 'ascii_button' onClick = {onClick}>{`${title} `}
            {state &&
            <span style = {{color:'white',backgroundColor:'blue'}}>{'[X]'}</span>
            }
            {!state &&
            '[ ]'
            }
        </div>
    )
}

export default AsciiButton