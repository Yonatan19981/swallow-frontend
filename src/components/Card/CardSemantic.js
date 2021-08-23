import React from 'react'
import { Card, Icon,Button } from 'semantic-ui-react'
import { isPropertySignature } from 'typescript'



const CardExampleCardProps = (props) => (


        <Col xs={12} md={6} lg={4} key={props.id}>
          <Card style={{ width: '18rem' }}>
            <Card.Header>header={props.header}</Card.Header>
            <Card.Img variant="top" src={props.image} />
            <Card.Body>
              <Card.Title>{props.title}</Card.Title>
              <Card.Text>
                {props.content}
              </Card.Text>
              <Button variant="primary">Add to cart</Button>
            </Card.Body>
          </Card>
        </Col>
      )
      
      export default CardExampleCardProps;
    image={props.image}
    header={props.header}
    meta={props.meta}
    description={props.description}
    extra={props.extra}

   
 
)

export default CardExampleCardProps
