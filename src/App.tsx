import React from 'react';
import { Grid } from 'gridjs-react';
import { Stack, IStackProps, mergeStyleSets, ContextualMenu, Toggle, Modal, IDragOptions, IIconProps, 
         Text, Link, FontWeights, IStackTokens, IContextualMenuProps, initializeIcons, getTheme } from '@fluentui/react';
import { useId, useBoolean } from '@fluentui/react-hooks';
import { IPersonaSharedProps, Persona, PersonaSize, PersonaPresence } from '@fluentui/react/lib/Persona';
import { MapContainer, TileLayer, Marker, Popup, Rectangle, Polygon } from 'react-leaflet';
import { DefaultButton, IconButton, IButtonStyles } from '@fluentui/react/lib/Button';
import { Label } from '@fluentui/react/lib/Label';
import { TestImages } from '@fluentui/example-data';
import './App.css';
import * as fieldData from "./datos/canchas-datos.json";
import { LatLng, LatLngExpression, popup } from 'leaflet';
import { TData } from 'gridjs/dist/src/types';

const greenOptions = { color: 'green' }
const theme = getTheme();

initializeIcons();

export const App: React.FunctionComponent = () => {

  const [isModalOpen, { setTrue: showModal, setFalse: hideModal }] = useBoolean(false);
  const [activeField, setActiveField] = React.useState(null);

  const examplePersona1: IPersonaSharedProps = {
    imageUrl: TestImages.personaFemale,
    imageInitials: 'YJ',
    text: 'Yackeline Jimenez',
    secondaryText: 'Medallista olímpica',
    tertiaryText: 'En una reunión',
    optionalText: 'Disponible a las 4:00pm',
  };

  const examplePersona2: IPersonaSharedProps = {
    imageUrl: TestImages.personaMale,
    imageInitials: 'JP',
    text: 'James Perez',
    secondaryText: 'Profesional en recreación y deporte',
    tertiaryText: 'Disponible',
    optionalText: 'Disponible ahora mismo',
  };

  const menuProps: IContextualMenuProps = {
    items: [
      {
        key: 'emailMessage',
        text: 'Enviar email',
        iconProps: { iconName: 'Mail' },
      },
      {
        key: 'calendarEvent',
        text: 'Agendar cita',
        iconProps: { iconName: 'Calendar' },
      },
    ],
  };

  return (
    <MapContainer center={[7.07249155397354, -73.8310737790208]} zoom={190} scrollWheelZoom={true}>
      
      <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                 url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {fieldData.canchas.map(cancha => (
        <Polygon key = {cancha.properties.PARK_ID}
                 pathOptions = {greenOptions}
                 positions = {(cancha.geometry.coordinates) as unknown as LatLngExpression[][]}>
                
                <Popup maxWidth={600}>
                  <Stack>
                    {/* Titulo del lugar */}
                    <Stack.Item>
                      <h1>{cancha.properties.NAME}</h1>
                    </Stack.Item>

                    {/* Informacion general del lugar */}
                    <Stack horizontal = {true}>
                      <Stack>                      
                        <Stack.Item>
                          <h3>{cancha.properties.DESCRIPTION[0]}</h3>
                        </Stack.Item>
                        <Stack.Item>
                          <DefaultButton
                            text="Más información"
                            split
                            menuProps={menuProps}
                            onClick={showModal}
                          />
                        </Stack.Item>

                        <Stack.Item>
                          <Label>Intructores</Label>
                          <Persona
                            {...examplePersona1}
                            size={PersonaSize.size40}
                            presence={PersonaPresence.away}
                            hidePersonaDetails={false}
                            imageAlt="Yackeline Jimenez, status is away"
                          />                         
                        </Stack.Item>

                        <Stack.Item>
                          <Persona
                              {...examplePersona2}
                              size={PersonaSize.size40}
                              presence={PersonaPresence.online}
                              hidePersonaDetails={false}
                              imageAlt="James Perez, status is online"
                            />
                        </Stack.Item>
                      </Stack>    

                      <Stack>
                        <div style={{ boxShadow: theme.effects.elevation64 }}>
                            <img src = {cancha.properties.IMAGES[0]}
                                width="100%"
                                height="100%"/>                           
                        </div>
                        <Stack.Item>
                          <p>{cancha.properties.DESCRIPTION[1]}</p>
                        </Stack.Item> 
                      </Stack>
                      
                    </Stack>
                  </Stack>

                  <Modal isOpen={isModalOpen}
                    onDismiss={hideModal}
                    isBlocking={false}
                    containerClassName={contentStyles.container}
                    key={cancha.properties.PARK_ID}
                  >
                    <div className={contentStyles.header}>
                      <span>{cancha.properties.NAME}</span>
                      <IconButton
                        styles={iconButtonStyles}
                        iconProps={cancelIcon}
                        onClick={hideModal}
                      />
                    </div>
                    <div className={contentStyles.body}>
                      <Stack horizontal={true}>
                        {/* Descripciones e informacion */}
                        <Stack>
                          <Stack.Item>
                            <h3>{cancha.properties.DESCRIPTION[0]}</h3>
                            <h3>{cancha.properties.DESCRIPTION[1]}</h3>
                          </Stack.Item>

                          {/* Tabla de informacion del lugar */}
                          <Stack.Item>
                            <Grid data = {cancha.properties.CLUBES as unknown as TData} 
                                  columns={['CLUBES']}/>
                          </Stack.Item>
                          <Stack.Item>
                            <Grid data = {cancha.properties.COBERTURA} 
                                  columns={['EDAD', 'CANTIDAD']}/>
                          </Stack.Item>
                        </Stack>

                        {/* Fotos del lugar */}
                        <Stack>
                          <div style={{ boxShadow: theme.effects.elevation64 }}>
                            <img src={cancha.properties.IMAGES[0]}
                              width="100%"
                              height="100%" />
                          </div>

                          <div style={{ boxShadow: theme.effects.elevation64 }}>
                            <img src={cancha.properties.IMAGES[1]}
                              width="100%"
                              height="100%" />
                          </div>

                        </Stack>
                      </Stack>
                    </div>
                  </Modal>
                </Popup>
        
        
        </Polygon>                  
      ))}

    </MapContainer>
    );
};

const contentStyles = mergeStyleSets({
  container: {
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
  },
  header: [
    theme.fonts.xxLarge,
    {
      flex: '1 1 auto',
      borderTop: `4px solid ${theme.palette.themePrimary}`,
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: '12px 12px 14px 24px',
    },
  ],
  body: {
    flex: '4 4 auto',
    padding: '0 24px 24px 24px',
    overflowY: 'hidden',
    selectors: {
      p: { margin: '14px 0' },
      'p:first-child': { marginTop: 0 },
      'p:last-child': { marginBottom: 0 },
    },
  },
});

const iconButtonStyles: Partial<IButtonStyles> = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

const cancelIcon: IIconProps = { iconName: 'Cancel' };
