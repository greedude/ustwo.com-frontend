import React from 'react';
import classnames from 'classnames';
import moment from 'moment';
import he from 'he';
import get from 'lodash/object/get';

import Flux from '../flux';

import SocialMediaStatistics from '../elements/social-media-statistics';

export default class SearchResultListItem extends React.Component {
  render() {
    const post = this.props.data;
    const category = get(post, '_embedded.wp:term.0.0.name', 'category');
    const imageURL = get(post, '_embedded.wp:attachment.1.source_url');
    const uri = `/blog/${get(post, 'slug')}`;

    return (
      <li key={get(post, 'slug')} className={classnames('search-result-list-item', `blog-label-${category.toLowerCase()}`)}>
        <div className='image' style={{backgroundImage: `url(${imageURL})`}}>
          <a href={uri} onClick={Flux.override(uri)}><img src={imageURL} /></a>
        </div>
        <div className='content'>
          <div className='blog-category'>{category}</div>
          <h2 className='title'>
            <a href={uri} onClick={Flux.override(uri)}>{he.decode(get(post, 'title.rendered'))}</a>
          </h2>
          <p className='meta'>By {get(post, '_embedded.author.0.first_name')} {get(post, '_embedded.author.0.last_name')} - <span className='date'>{moment(get(post, 'date')).format('D MMMM YYYY')}</span></p>
          <SocialMediaStatistics facebookShares={get(post, 'facebookShares')} twitterShares={get(post, 'twitterShares')} />
          <div className='tail'>
            <a href={uri} onClick={Flux.override(uri)}>Read more</a>
          </div>
        </div>
      </li>
    );
  }
}
