import { Link } from 'react-router-dom';
import { IoEyeOutline } from 'react-icons/io5';

const Blog = ({ blog }) => {
  return (
    <Link to={`/blog/${blog._id}`}>
  <div
    className='blog-card card position-relative'
    style={{ width: '300px', height: '440px' }}
  >
    <div className='card-image' style={{width: "298px", height: "155px"}}>
      <img src={blog.image} className='img-fluid' alt='blog' />
    </div>

    <div className='blog-content'>
    <h5
        className='desc'
        dangerouslySetInnerHTML={{
          __html: blog.title
            ? blog.title.substr(0, 21) + '...'
            : '',
        }}
      ></h5>
      <div className='row'>
        <div className='col-6'>
          <h6 className='title3'>{blog.category}</h6>
        </div>
        <div className='col-3'>
        </div>
        <div className='col-3'>
          <IoEyeOutline /> {blog.numViews}
        </div>
      </div>

      <p
        className='desc'
        dangerouslySetInnerHTML={{
          __html: blog.description
            ? blog.description.substr(0, 180) + '...'
            : '',
        }}
      ></p>
      <div className='text-end position-absolute bottom-0 start-0 end-0' style={{paddingBottom: "15px", paddingRight:"15px"}}>
        <Link to={'/blog/' + blog.id} className='button py-2'>
          ĐỌC THÊM
        </Link>
      </div>
    </div>
  </div>
</Link>

  );
};

export default Blog;
