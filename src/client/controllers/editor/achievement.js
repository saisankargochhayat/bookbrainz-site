/*
 * Copyright (C) 2016  Daniel Hsing
 * 				 2015  Ben Ockmore
 *               2015  Sean Burke
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation; either version 2 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License along
 * with this program; if not, write to the Free Software Foundation, Inc.,
 * 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301 USA.
 */

const React = require('react');
const ReactDOM = require('react-dom');
const AchievementsTab =
	require('../../components/pages/parts/editor-achievements');
const Layout =
	require('../../containers/layout');
const EditorContainer =
	require('../../containers/editor');
const propHelpers = require('../../../server/helpers/props');

const propsTarget = document.getElementById('props');
const props = propsTarget ? JSON.parse(propsTarget.innerHTML) : {};

ReactDOM.render(
	<Layout {...propHelpers.extractLayoutProps(props)}>
		<EditorContainer
			{...propHelpers.extractEditorProps(props)}
		>
			<AchievementsTab
				achievement={props.achievement}
				editor={props.editor}
			/>
		</EditorContainer>
	</Layout>,
	document.getElementById('target')
);
