/*
 * Copyright (C) 2016  Max Prettyjohns
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

'use strict';

const chai = require('chai');
const chaiAsPromised = require('chai-as-promised');
chai.use(chaiAsPromised);
const expect = chai.expect;
const Promise = require('bluebird');
const rewire = require('rewire');

const Editor = require('./bookbrainz-data').Editor;
const {TEST_LIB} = process.env;
const Achievement =
	rewire(`../${TEST_LIB ? 'lib' : 'src'}/server/helpers/achievement.js`);
const testData = require('../data/test-data.js');

const funRunnerThreshold = 7;
const funRunnerDays = 6;

module.exports = () => {
	beforeEach(() => testData.createEditor()
		.then(() =>
			testData.createFunRunner()
		)
	);

	afterEach(testData.truncate);

	it('should be given to someone with a revision a day for a week',
		() => {
			Achievement.__set__({
				getEditsInDays: (editorId, days) => {
					let editPromise;
					if (days === funRunnerDays) {
						editPromise = Promise.resolve(funRunnerThreshold);
					}
					else {
						editPromise = Promise.resolve(0);
					}
					return editPromise;
				}
			});
			const achievementPromise = new Editor({
				name: testData.editorAttribs.name
			})
			.fetch()
			.then((editor) =>
				Achievement.processEdit(editor.id)
			)
			.then((edit) =>
				edit.funRunner['Fun Runner']
			);

			return Promise.all([
				expect(achievementPromise).to.eventually.have
					.property('editorId', testData.editorAttribs.id),
				expect(achievementPromise).to.eventually.have
					.property('achievementId', testData.funRunnerAttribs.id)
			]);
		});

	it('shouldn\'t be given to someone without a revision a day for a week',
		() => {
			Achievement.__set__({
				getEditsInDays: (editorId, days) => {
					let editPromise;
					if (days === funRunnerDays) {
						editPromise = Promise.resolve(funRunnerThreshold - 1);
					}
					else {
						editPromise = Promise.resolve(0);
					}
					return editPromise;
				}
			});
			const achievementPromise = new Editor({
				name: testData.editorAttribs.name
			})
			.fetch()
			.then((editor) =>
				Achievement.processEdit(editor.id)
			)
			.then((edit) =>
				edit.funRunner['Fun Runner']
			);

			return expect(achievementPromise).to.eventually.equal(false);
		});
};
