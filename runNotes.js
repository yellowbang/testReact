var notesStorage = JSON.parse(localStorage.getItem('notesStorage'));
if (!notesStorage || notesStorage.length === 0) {
	notesStorage = [{text:'111'}, {text:'222'}];
    localStorage.setItem('notesStorage', JSON.stringify(notesStorage));
}

var NoteModel = Backbone.Model.extend({
	defaults: {
		text: "new message 1",
		liked: false
	},

	initialize: function (){
		this.on('change', function(){
			console.log('---------- model change -----')
		})
	}
});

var NoteCollections = Backbone.Collection.extend({
    model: NoteModel
});

var noteCollections = new NoteCollections;
notesStorage.map(function(note){
	noteCollections.add(note)
});


var saveToServer = function(){
	var data = [];
	noteCollections.map(function(note){data.push(note.attributes)});
    localStorage.setItem('notesStorage', JSON.stringify(data));
};

var Checkbox = React.createClass({
	getInitialState: function(){
		return {checked: false}
	},
	handleCheck: function(){
		this.setState({checked: !this.state.checked})
	},
	render: function(){
		return(
			<div>
				<input type="checkbox" />
			</div>
		)
	}
});

var Like = React.createClass({
	getInitialState: function(){
		return {liked: false}
	},
	handleClick: function(){
		this.props.model.set('liked', !this.props.model.get('liked'));
		saveToServer();
		this.forceUpdate();
	},
	renderLikedState: function(){
		return(
			<div>
				<p className="like liked" onClick={this.handleClick}> liked </p>
			</div>
		)
	},
	renderNormalState: function(){
		return(
			<div>
				<p className="like normal" onClick={this.handleClick}> like </p>
			</div>
		)
	},
	render: function(){
		if (this.props.model.get('liked')){
			return this.renderLikedState();
		}
		return this.renderNormalState();
	}
});

var YouTube = React.createClass({
	render: function(){
		var videoSrc = "http://www.youtube.com/embed/" + this.props.video;
		var width = 0.8 * window.innerWidth + 'px';
		var height = 0.8 * window.innerHeight + 'px';
		return (
			<div className="youTubeContainer">
				<iframe className="youTubePlayer" width={width} height={height} src={videoSrc} frameBorder="0" allowFullScreen></iframe>
			</div>
		)
	}
});

var Note = React.createClass({
	getInitialState: function(){
		return {editting: false};
	},
	edit: function(){
		this.setState({editting: true});
		console.log('edit');
	},
	onSave: function(event){
		this.setState({editting: false});
		var textarea =event.target.parentNode.getElementsByClassName('form-control')[0].value;
		this.props.model.set('text', textarea);
		saveToServer();
	},
	onRemoveClick: function(){
		this.setState({editting: false});
		this.props.onRemove(this.props.noteIndex);
	},
    renderDisplay: function(){
    	var returnValue = 
    		<div className="note">
    			<p>{this.props.model.get('text')}</p>
    			<Checkbox></Checkbox>
    			<Like model={this.props.model}></Like>
    			<span>
    				<button onClick={this.edit} className="btn btn-primary glyphicon glyphicon-pencil">edit
    				</button>
    				<button onClick={this.onRemoveClick} className="btn btn-danger glyphicon glyphicon-trash">remove
    				</button>
    			</span>
    		</div>
        return (
    		returnValue
        )
    },
    renderForm: function(){
    	return(
    		<div className="note">
    			<textarea defaultValue={this.props.children} className="form-control"/>
    			<button onClick={this.onSave} className="btn btn-success btn-sm glyphicon glyphicon-floppy-disk"/>
    		</div>
    	)
    },
    render: function(){
    	if (this.state.editting){
    		return this.renderForm();
    	}
    	return this.renderDisplay();
    }
});

var Notes = React.createClass({
	getInitialState: function(){
		return {
			notes:noteCollections
		}
	},
    add: function(text) {
        var arr = this.state.notes.models;
        arr.push(new NoteModel({text:'new note'}));
        this.setState({notes: arr});
		saveToServer();
    },
	remove: function(i) {
		noteCollections.remove(noteCollections.models[i])
        this.setState({notes: noteCollections});
		saveToServer();
    },
	render: function(){
		return (<div className="board">
            {this.state.notes.map(function(note, i){
                return (
                    <Note model={note} noteIndex={i} key={i} onRemove={this.remove}></Note>
                );
            }.bind(this))}
            <button className="btn btn-sm btn-success glyphicon glyphicon-plus" onClick={this.add.bind(null, "New Note")}/>
        </div>);
	}
});

ReactDOM.render(<Notes></Notes>, document.getElementById('div1'));
ReactDOM.render(<YouTube video="c--ORK53RU4"></YouTube>, document.getElementById('div2'));
