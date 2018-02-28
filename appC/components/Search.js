import React, { Component } from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import OAuthSimple from 'oauthsimple'


class Search extends Component {
  state = {
    position: 'unknown'
  };

  componentDidMount() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({position});
      },
      (error) => alert(error),
      {enableHighAccuracy: true, timeout: 20000, maximumAge: 1000}
    );
  }

  fetchData() {
    var lat = this.state.position.coords.latitude
    var lng = this.state.position.coords.longitude
    var latlng = "ll=" + String(lat) + "," + String(lng)
    var consumerKey = "***"
    var consumerSecret = "***"
    var tokenSecret = "***"
    var token = "***"

    oauth = new OAuthSimple(consumerKey, tokenSecret)
    request = oauth.sign({
      action: "GET",
      path: "https://api.yelp.com/v2/search",
      parameters: "term=coffee&" + latlng,
      signatures: {api_key: consumerKey, shared_secret: consumerSecret, access_token: token, access_secret: tokenSecret},

    })

    var nav = this.props.navigator

    fetch(request.signed_url, {method: "GET"}).then(function(response){
      return response.json()
    }).then(function(data){
      nav.push({
        ident: "Results",
        data: data
      })
    }).catch(function(error){
      console.log("Error:", error)
    })

  }

  render() {
    return (
      <View style={styles.container}>

        <Text style={styles.welcome}>
          WheresMyCoffee
        </Text>

        <TouchableOpacity
          style={{borderRadius: 7,padding: 10,  backgroundColor: '#4d9be3'}}
          onPress={this.fetchData.bind(this)}>
          <Text style={{fontSize: 15}}>Find Coffee!</Text>
        </TouchableOpacity>

      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  welcome: {
    fontSize: 30,
    textAlign: 'center',
    margin: 10,
    marginBottom: 30
  }
});

module.exports = Search
