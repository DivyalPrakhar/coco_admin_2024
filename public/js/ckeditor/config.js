/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see https://ckeditor.com/legal/ckeditor-oss-license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	config.font_names = 'Hindi/Kruti;' + 'Roboto;' + 'Symbol;' + 'KAP126;' + 'KAP127;'+ 'Nirmala;'+config.font_names;
	config.toolbarGroups = [
		{ name: 'document', groups: [ 'mode', 'document', 'doctools' ] },
		{ name: 'clipboard', groups: [ 'clipboard', 'undo' ] },
		{ name: 'forms', groups: [ 'forms' ] },
		{ name: 'basicstyles', groups: [ 'basicstyles', 'cleanup' ] },
		{ name: 'editing', groups: [ 'find', 'selection', 'spellchecker', 'editing' ] },
		{ name: 'links', groups: [ 'links' ] },
		{ name: 'paragraph', groups: [ 'list', 'indent', 'blocks', 'align', 'bidi', 'paragraph' ] },
		{ name: 'insert', groups: [ 'insert' ] },
		{ name: 'styles', groups: [ 'styles' ] },
		{ name: 'colors', groups: [ 'colors' ] },
		{ name: 'tools', groups: [ 'tools' ] },
		{ name: 'others', groups: [ 'others' ] },
		{ name: 'about', groups: [ 'about' ] }
	];

      config.removeButtons = 'Maximize,ShowBlocks,About,Smiley,Language,Blockquote,Anchor,CreateDiv,Indent,Outdent,HiddenField,Button,Select,Textarea,TextField,Radio,Checkbox,Form,SelectAll,NewPage,Preview,Print,Link,Unlink,BidiLtr,BidiRtl,CopyFormatting,Save,Templates,PasteFromWord,Find,Replace,AutoCorrect,Flash,BGColor,TextColor';

	config.specialChars = config.specialChars.concat( [ [ '&alpha;', 'alpha' ],
      [ '&beta;', 'beta' ],
      [ '&gamma;', 'gamma' ],
      [ '&delta;', 'delta' ],
      [ '&epsilon;', 'epsilon' ],
      [ '&zeta;', 'zeta' ],     
      [ '&eta;', 'eta' ],
      [ '&theta;', 'theta' ],
      [ '&iota;', 'iota' ],
      [ '&kappa;', 'kappa' ],
      [ '&lambda;', 'lambda' ],
      [ '&mu;', 'mu' ],
      [ '&nu;', 'nu' ],
      [ '&xi;', 'xi' ],
      [ '&omicron;', 'omicron' ],
      [ '&pi;', 'pi' ],
      [ '&rho;', 'rho' ],
      [ '&sigma;', 'sigma' ],
      [ '&tau;', 'tau' ],
      [ '&upsilon;', 'upsilon' ],
      [ '&phi;', 'phi' ],
      [ '&chi;', 'chi' ],
      [ '&psi;', 'psi' ],
      [ '&omega;', 'omega' ],
      [ '&#8377;', 'rupee' ] ] );

      config.keystrokes =
        [    
            [ CKEDITOR.CTRL + 188 /*COMMA*/, 'subscript' ],
            [ CKEDITOR.CTRL + 190 /*PERIOD*/, 'superscript' ],
        ];
};
